import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

function usePushNotifications() {
  useEffect(() => {
    // Only run this on Android or iOS
    if (Capacitor.getPlatform() === 'web') {
      console.log('Push Notifications not supported on web');
      return;
    }

    // Request permissions
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });

    // Get token
    PushNotifications.addListener('registration', token => {
      console.log('FCM Token:', token.value);
      // TODO: Send this token to your backend
    });

    // When notification is received
    PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Notification received:', notification);
    });

    // When user taps the notification
    PushNotifications.addListener('pushNotificationActionPerformed', result => {
      console.log('Notification action performed', result.notification);
    });

  }, []);
}

export default usePushNotifications;
