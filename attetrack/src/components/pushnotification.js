// usePushNotifications.js
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

function usePushNotifications() {
  useEffect(() => {
    if (Capacitor.getPlatform() === 'web') {
      console.log('Push Notifications not supported on web');
      return;
    }

    PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('🔔 Notification received:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', result => {
      console.log('📲 Notification tapped:', result.notification);
    });
  }, []);
}

export default usePushNotifications;
