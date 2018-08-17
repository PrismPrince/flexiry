// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('/__/firebase/5.2.0/firebase-app.js');
importScripts('/__/firebase/5.2.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');

var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
  var { title, icon, body } = payload.notification;
  var { badge } = payload.data;

  return self.registration.showNotification(title, {
    icon,
    body,
    badge,
    vibrate: [300, 100, 400, 100, 300]
  });
});
