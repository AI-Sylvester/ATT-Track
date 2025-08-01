const express = require('express');
const router = express.Router();
const pool = require('../db');
const { sendPushNotification } = require('../firebaseadmin');

router.post('/', async (req, res) => {
  const { empnumber, type, session, fromTime, toTime, permissionType, approvedBy } = req.body;

  if (!empnumber || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const client = await pool.connect();

    const empRes = await client.query(
      `SELECT "Name" FROM "EMPLOYEEMAS" WHERE "EmpNumber" = $1`,
      [empnumber]
    );
    if (empRes.rowCount === 0) return res.status(404).json({ error: 'Employee not found' });

    const name = empRes.rows[0].Name;
    const now = new Date();
    const entryDate = now.toISOString().split('T')[0];

    await client.query(`
      INSERT INTO "LeavePermission" 
      ("EmpNumber", "Type", "Session", "FromTime", "ToTime", "PermissionType", "ApprovedBy", "EntryDate")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `, [empnumber, type, session, fromTime, toTime, permissionType, approvedBy, entryDate]);

    // Notify
    const tokens = await client.query(`SELECT "Token" FROM "DeviceTokens"`);
    for (const row of tokens.rows) {
      await sendPushNotification(
        row.Token,
        `${type} request from ${name}`,
        type === 'Leave' ? `Session: ${session}` :
        `Time: ${fromTime} - ${toTime} (${permissionType})`
      );
    }

    client.release();
    res.json({ message: `${type} request submitted` });
  } catch (err) {
    console.error('Leave/Permission Error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;
