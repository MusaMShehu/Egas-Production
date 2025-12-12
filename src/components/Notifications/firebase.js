import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDYz6AX4CEb2HMzVe6p8sv8_c3gkHHOOmY",
  authDomain: "egas-nigeria.firebaseapp.com",
  projectId: "egas-nigeria",
  storageBucket: "egas-nigeria.firebasestorage.app",
  messagingSenderId: "1049777965114",
  appId: "1:1049777965114:web:380c7a9bd101441b338d03",
  measurementId: "G-G3B8YSV1BK"
};


const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Request permission and get token
export const requestForToken = () => {
  return getToken(messaging, { 
    vapidKey: 'YOUR_VAPID_KEY' 
  })
  .then((currentToken) => {
    if (currentToken) {
      console.log('Current token for client: ', currentToken);
      // Send token to your backend
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  })
  .catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  });
};

// Handle foreground messages
export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};