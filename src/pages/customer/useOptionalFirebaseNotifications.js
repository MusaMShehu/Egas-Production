// import { useContext } from 'react';
// import { NotificationContext } from '../../contexts/FirebaseNotificationContext';

// /**
//  * Returns the Firebase notification context if available, otherwise null.
//  * Uses React's `useContext` — does NOT throw when the provider is missing.
//  *
//  * NOTE: This only works when `FirebaseNotificationContext` is exported as a
//  * React Context object. If your file exports only a provider, adjust the
//  * import accordingly — this adapter is the only place that needs to change.
//  */
// export function useOptionalFirebaseNotifications() {
//   const ctx = useContext(NotificationContext);
//   return ctx || null;
// }








import { useNotification } from '../../contexts/FirebaseNotificationContext';

/**
 * Returns Firebase notification functionality when available.
 * Returns null when the notification provider is not mounted,
 * provided useNotification returns null in that situation.
 */
export function useOptionalFirebaseNotifications() {
  return useNotification() || null;
}

export default useOptionalFirebaseNotifications;
