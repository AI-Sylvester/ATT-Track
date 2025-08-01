const express = require('express');
const router = express.Router();
const pool = require('../db');
const sendPushNotification = require('../utils/push');

router.post('/', async (req, res) => {
  const { empnumber, type, session, fromTime, toTime, permissionType, approvedBy } = req.body;

  if (!empnumber || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const client = await pool.connect();

    // Get employee name
    const empRes = await client.query(
      `SELECT "Name" FROM "EMPLOYEEMAS" WHERE "EmpNumber" = $1`,
      [empnumber]
    );
    if (empRes.rowCount === 0) {
      client.release();
      return res.status(404).json({ error: 'Employee not found' });
    }

    const name = empRes.rows[0].Name;
    const now = new Date();
    const entryDate = now.toISOString().split('T')[0];

    // Handle empty optional fields by converting "" to null
    const cleanSession = session === '' ? null : session;
    const cleanFromTime = fromTime === '' ? null : fromTime;
    const cleanToTime = toTime === '' ? null : toTime;
    const cleanPermissionType = permissionType === '' ? null : permissionType;

    await client.query(`
      INSERT INTO "LeavePermissionRequests" 
      ("EmpNumber", "Type", "Session", "FromTime", "ToTime", "PermissionType", "ApprovedBy", "EntryDate")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      empnumber,
      type,
      cleanSession,
      cleanFromTime,
      cleanToTime,
      cleanPermissionType,
      approvedBy,
      entryDate
    ]);

    // Send push notifications to all device tokens
    const tokens = await client.query(`SELECT "Token" FROM "DeviceTokens"`);
    for (const row of tokens.rows) {
      await sendPushNotification(
        row.Token,
        `${type} request from ${name}`,
        type === 'Leave'
          ? `Session: ${cleanSession || 'N/A'}`
          : `Time: ${cleanFromTime || '-'} - ${cleanToTime || '-'} (${cleanPermissionType || '-'})`
      );
    }

    client.release();
    res.json({ message: `${type} request submitted` });
  } catch (err) {
    console.error('Leave/Permission Error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});
router.get('/', async (req, res) => {
  const { filter } = req.query;
  let condition = '1=1'; // default: no filter

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  if (filter === 'Today') {
    condition = `"EntryDate" = CURRENT_DATE`;
  } else if (filter === 'Week') {
    condition = `"EntryDate" >= CURRENT_DATE - INTERVAL '7 days'`;
  } else if (filter === 'Month') {
    condition = `"EntryDate" >= '${firstDayOfMonth.toISOString().slice(0, 10)}'`;
  } else if (filter === 'LastMonth') {
    condition = `"EntryDate" BETWEEN '${firstDayOfLastMonth.toISOString().slice(0, 10)}' AND '${lastDayOfLastMonth.toISOString().slice(0, 10)}'`;
  }

  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM "LeavePermissionRequests" WHERE ${condition} ORDER BY "CreatedAt" DESC`);
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('Get Leave/Permission Error:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
