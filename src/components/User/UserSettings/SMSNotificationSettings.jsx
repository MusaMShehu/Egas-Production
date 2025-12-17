// components/SMSNotificationSettings.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  Typography,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import api from '../services/api';

const SMSNotificationSettings = () => {
  const [settings, setSettings] = useState({
    accountCreated: true,
    orderUpdates: true,
    orderDelivery: true,
    subscriptionUpdates: true,
    subscriptionReminders: true,
    walletUpdates: true,
    supportUpdates: true,
    promotional: false
  });
  
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications/settings');
      setSettings(response.data.smsSettings || settings);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (setting) => (event) => {
    setSettings({
      ...settings,
      [setting]: event.target.checked
    });
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      await api.put('/notifications/settings', { smsSettings: settings });
      showNotification('Settings saved successfully!', 'success');
    } catch (error) {
      showNotification('Failed to save settings', 'error');
      console.error('Save error:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const notificationGroups = [
    {
      title: 'Account Notifications',
      items: [
        { key: 'accountCreated', label: 'Account creation welcome message' }
      ]
    },
    {
      title: 'Order Notifications',
      items: [
        { key: 'orderUpdates', label: 'Order updates and confirmations' },
        { key: 'orderDelivery', label: 'Delivery status updates' }
      ]
    },
    {
      title: 'Subscription Notifications',
      items: [
        { key: 'subscriptionUpdates', label: 'Subscription status changes' },
        { key: 'subscriptionReminders', label: 'Delivery reminders (1 day before)' }
      ]
    },
    {
      title: 'Other Notifications',
      items: [
        { key: 'walletUpdates', label: 'Wallet transactions' },
        { key: 'supportUpdates', label: 'Support ticket updates' },
        { key: 'promotional', label: 'Promotional messages and offers' }
      ]
    }
  ];

  if (loading) {
    return <Typography>Loading settings...</Typography>;
  }

  return (
    <Box>
      <Card>
        <CardHeader 
          title="SMS Notification Preferences" 
          subheader="Choose which SMS notifications you want to receive"
        />
        <CardContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            SMS notifications will be sent to your verified phone number. Standard carrier rates may apply.
          </Alert>

          {notificationGroups.map((group, index) => (
            <Box key={group.title} sx={{ mb: index < notificationGroups.length - 1 ? 3 : 0 }}>
              <Typography variant="h6" gutterBottom>
                {group.title}
              </Typography>
              
              {group.items.map((item) => (
                <FormControlLabel
                  key={item.key}
                  control={
                    <Switch
                      checked={settings[item.key]}
                      onChange={handleToggle(item.key)}
                      color="primary"
                    />
                  }
                  label={item.label}
                  sx={{ display: 'block', mb: 1 }}
                />
              ))}
              
              {index < notificationGroups.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={handleSave}
              loading={saveLoading}
            >
              Save Preferences
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SMSNotificationSettings;