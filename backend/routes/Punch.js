const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pool = require('../db');
const sendPushNotification = require('../utils/push');
// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
module.exports = router;
