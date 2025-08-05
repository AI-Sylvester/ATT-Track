const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

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
    EmpNumber, Name, DOB, Department, Mobile, Mobile2,
    DOJ, Address, Designation, GuardianName, GuardianNumber,
    Password, Active
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO "EMPLOYEEMAS" 
      ("EmpNumber", "Name", "DOB", "Department", "Mobile", "Mobile2", 
       "DOJ", "Address", "Designation", "GuardianName", "GuardianNumber", 
       "Password", "Active") 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        EmpNumber, Name, DOB, Department, Mobile, Mobile2,
        DOJ, Address, Designation, GuardianName, GuardianNumber,
        Password, Active
      ]
    );
    res.status(201).json({ message: 'Employee added successfully' });
  } catch (err) {
    console.error('Error inserting employee:', err);
    res.status(500).json({ error: 'Failed to add employee' });
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
    const result = await pool.query(`SELECT MAX(CAST("EmpNumber" AS INTEGER)) AS max_emp FROM "EMPLOYEEMAS"`);
    const nextEmpNumber = (parseInt(result.rows[0].max_emp) || 1000) + 1;
    res.json({ nextEmpNumber });
  } catch (err) {
    console.error('Error getting next EmpNumber:', err);
    res.status(500).json({ error: 'Failed to get next EmpNumber' });
  }
});

router.get('/departments', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT "Department" FROM "EMPLOYEEMAS" WHERE "Department" IS NOT NULL');
    const departments = result.rows.map(row => row.Department);
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
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
router.post('/login', async (req, res) => {
  const { EmpNumber, Password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM "EMPLOYEEMAS" WHERE "EmpNumber" = $1 AND "Password" = $2 AND "Active" = true`,
      [EmpNumber, Password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const employee = result.rows[0];

    const token = jwt.sign(
      {
        empnumber: employee.EmpNumber,
        name: employee.Name,
        role: 'employee',
      },
JWT_SECRET,      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login successful',
      token,
      empnumber: employee.EmpNumber,
      name: employee.Name,
    });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

router.get('/basic-info/:empnumber', async (req, res) => {
  const empnumber = req.params.empnumber;
  try {
    const result = await pool.query(
      `SELECT "Name", "Department" FROM "EMPLOYEEMAS" WHERE "EmpNumber" = $1`,
      [empnumber]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Fetch basic-info error:', err);
    res.status(500).json({ error: 'Server error fetching info' });
  }
});
module.exports = router;
