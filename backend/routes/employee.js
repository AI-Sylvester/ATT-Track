const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "EMPLOYEEMAS" ORDER BY "ID" DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});
router.post('/', async (req, res) => {
  const {
    Name, DOB, Department, Mobile, Mobile2,
    DOJ, Address, Designation, GuardianName, GuardianNumber,
    Password, Active
  } = req.body;

  try {
    // Get current max EmpNumber
    const result = await pool.query('SELECT MAX("EmpNumber") AS max_emp FROM "EMPLOYEEMAS"');
    const currentMax = result.rows[0].max_emp || 999;
    const nextEmpNumber = currentMax + 1;

    if (nextEmpNumber > 9999) {
      return res.status(400).json({ error: 'Max EmpNumber limit reached' });
    }

    await pool.query(`
      INSERT INTO "EMPLOYEEMAS" (
        "EmpNumber", "Name", "DOB", "Department", "Mobile", "Mobile2", "DOJ",
        "Address", "Designation", "GuardianName", "G.Number", "Password", "Active"
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    `, [
      nextEmpNumber, Name, DOB, Department, Mobile, Mobile2, DOJ,
      Address, Designation, GuardianName, GuardianNumber, Password, Active
    ]);

    res.json({ message: 'Employee added successfully', EmpNumber: nextEmpNumber });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add employee', details: err.message });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const {
    EmpNumber, Name, DOB, Department, Mobile, Mobile2,
    DOJ, Address, Designation, GuardianName, GuardianNumber,
    Password, Active
  } = req.body;

  try {
    await pool.query(`
      UPDATE "EMPLOYEEMAS" SET
        "EmpNumber"=$1, "Name"=$2, "DOB"=$3, "Department"=$4,
        "Mobile"=$5, "Mobile2"=$6, "DOJ"=$7, "Address"=$8,
        "Designation"=$9, "GuardianName"=$10, "G.Number"=$11,
        "Password"=$12, "Active"=$13
      WHERE "ID"=$14
    `, [
      EmpNumber, Name, DOB, Department, Mobile, Mobile2, DOJ,
      Address, Designation, GuardianName, GuardianNumber, Password, Active, id
    ]);

    res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update employee', details: err.message });
  }
});
router.get('/next-empnumber', async (req, res) => {
  try {
    const result = await pool.query('SELECT MAX("EmpNumber") AS max_emp FROM "EMPLOYEEMAS"');
    const maxEmp = result.rows[0].max_emp || 999;
    const nextEmp = maxEmp + 1;
    if (nextEmp > 9999) return res.status(400).json({ error: 'Limit reached' });
    res.json({ nextEmpNumber: nextEmp });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch next EmpNumber' });
  }
});
router.get('/basic', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT "EmpNumber", "Name", "Department"
      FROM "EMPLOYEEMAS"
      WHERE "Active" = true
      ORDER BY "EmpNumber"
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch basic employee info:', err);
    res.status(500).json({ error: 'Failed to fetch employee list' });
  }
});

module.exports = router;
