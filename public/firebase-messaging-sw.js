// public/firebase-messaging-sw.js - Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDYz6AX4CEb2HMzVe6p8sv8_c3gkHHOOmY',
  authDomain: 'egas-nigeria.firebaseapp.com',
  projectId: 'egas-nigeria',
  storageBucket: 'egas-nigeria.firebasestorage.app',
  messagingSenderId: '1049777965114',
  appId: '1:1049777965114:web:380c7a9bd101441b338d03',
  measurementId: 'G-G3B8YSV1BK'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
    badge: '/badge.png',
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    // Open specific URL based on notification data
    const urlToOpen = new URL('/dashboard/notifications', self.location.origin);
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen.href && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});