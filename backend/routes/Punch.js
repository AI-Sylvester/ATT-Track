const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pool = require('../db');
const sendPushNotification = require('../utils/push');
// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true }); // Make sure folder exists

router.post('/', async (req, res) => {
  const { empnumber, location, image } = req.body;

  if (!empnumber || !location || !image) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const client = await pool.connect();

    const empRes = await client.query(
      `SELECT "ID", "Name" FROM "EMPLOYEEMAS" WHERE "EmpNumber" = $1`,
      [empnumber]
    );
    if (empRes.rowCount === 0) {
      client.release();
      return res.status(404).json({ error: 'Employee not found' });
    }
    const empcode = empRes.rows[0].ID;
    const empName = empRes.rows[0].Name;

const now = new Date();
const entryDate = now.toISOString().split('T')[0];
const entryTime = now.toLocaleTimeString('en-GB', {
  hour12: false,
  timeZone: 'Asia/Kolkata',
});
    const punchRes = await client.query(
      `SELECT COUNT(*) FROM "AppTimeDet" WHERE "Empnumber" = $1 AND "EntryDate" = $2`,
      [empnumber, entryDate]
    );
    const punchCount = parseInt(punchRes.rows[0].count);
   const attendType = punchCount % 2 === 0 ? 'CheckIn' : 'CheckOut';

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const filename = `${empnumber}_${Date.now()}.jpg`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, base64Data, 'base64');

    await client.query(
      `INSERT INTO "AppTimeDet" 
      ("Empcode", "Empnumber", "Location", "Workplace", "EntryDate", "EntryTime", "Imagepath", "AttendType")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        empcode,
        empnumber,
        location,
        'Office',
        entryDate,
        entryTime,
        'uploads/' + filename,
        attendType
      ]
    );

    // 🔔 Get token & send push notification
   const tokensRes = await client.query(`SELECT "Token" FROM "DeviceTokens"`);

for (const row of tokensRes.rows) {
    console.log('📲 Sending to token:', row.Token);
  await sendPushNotification(
    row.Token,
    `${attendType} marked for ${empName}`,
    `Time: ${entryTime}, Date: ${entryDate}`
  );
}


    client.release();
    res.json({ message: `${attendType} successful` });
  } catch (err) {
    console.error('Punch Error:', err);
    res.status(500).json({ error: 'Failed to record punch', details: err.message });
  }
});

// 📄 GET /today - Show today's punch logs
router.get('/today', async (req, res) => {
  try {
    const client = await pool.connect();
    const today = new Date().toISOString().split('T')[0];

    const result = await client.query(
      `
      SELECT 
        e."Name", 
        e."Department", 
          a."Empnumber",  
        a."AttendType", 
        a."EntryTime" 
      FROM "AppTimeDet" a
      JOIN "EMPLOYEEMAS" e ON a."Empcode"::int = e."ID"
      WHERE a."EntryDate" = $1
      ORDER BY a."EntryTime" DESC
      `,
      [today]
    );

    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Fetch Punch Logs Error:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});
router.get('/summary', async (req, res) => {
  try {
    const client = await pool.connect();
    const today = new Date().toISOString().split('T')[0];

    const result = await client.query(`
      SELECT 
        e."EmpNumber",
        e."Name",
        MIN(CASE WHEN a."AttendType" = 'CheckIn' THEN a."EntryTime" END) AS "CheckIn",
        MAX(CASE WHEN a."AttendType" = 'CheckOut' THEN a."EntryTime" END) AS "CheckOut"
      FROM "AppTimeDet" a
      JOIN "EMPLOYEEMAS" e ON a."Empcode"::int = e."ID"
      WHERE a."EntryDate" = $1
      GROUP BY e."EmpNumber", e."Name"
      ORDER BY e."Name"
    `, [today]);

    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Fetch Summary Error:', err);
    res.status(500).json({ error: 'Failed to fetch summary', details: err.message });
  }
});

router.get('/summaryemp/:empNumber', async (req, res) => {
  const { empNumber } = req.params;

  try {
    const client = await pool.connect();

    const result = await client.query(`
      SELECT 
        a."EntryDate",
        e."EmpNumber",
        e."Name",
        MIN(CASE WHEN a."AttendType" = 'CheckIn' THEN a."EntryTime" END) AS "CheckIn",
        MAX(CASE WHEN a."AttendType" = 'CheckOut' THEN a."EntryTime" END) AS "CheckOut",
        COUNT(*) AS "PunchCount"
      FROM "AppTimeDet" a
      JOIN "EMPLOYEEMAS" e ON a."Empcode"::int = e."ID"
      WHERE e."EmpNumber" = $1
      GROUP BY a."EntryDate", e."EmpNumber", e."Name"
      ORDER BY a."EntryDate" DESC
    `, [empNumber]);

    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Summary Fetch Error:', err);
    res.status(500).json({ error: 'Database error while fetching attendance summary' });
  }
});

router.get('/:date/:empnumber', async (req, res) => {
  const { date, empnumber } = req.params;

  try {
    const client = await pool.connect();

    const result = await client.query(
      `
      SELECT 
        e."Name", 
        e."Department", 
        a."Empnumber",  
        a."AttendType", 
        a."EntryTime" 
      FROM "AppTimeDet" a
      JOIN "EMPLOYEEMAS" e ON a."Empcode"::int = e."ID"
      WHERE a."EntryDate"::date = $1 AND a."Empnumber" = $2
      ORDER BY a."EntryTime" DESC
      `,
      [date, empnumber]
    );

    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Fetch Punch Logs Error:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});



module.exports = router;
