// backend/utils/push.js
const admin = require('../firebaseadmin');

async function sendPushNotification(token, title, body) {
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Push sent:', response);
    return response;
  } catch (error) {
    console.error('❌ Push failed:', error);
    throw error;
  }
}

module.exports = sendPushNotification;
