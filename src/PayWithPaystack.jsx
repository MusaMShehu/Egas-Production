import React from 'react';
import initializePaystack from '@paystack/inline-js';
import axios from 'axios';

const PayWithPaystack = ({ amount, email, orderId, onSuccess }) => {
  const handlePay = async () => {
    try {
      // initialize on backend
      const { data } = await axios.post('https://egas-server.onrender.com/api/payments/initialize', { amount, email, orderId });
      const { authorization_url, reference } = data;

      // Option A: redirect user to authorization_url
      // window.location.href = authorization_url;

      // Option B: use inline popup
      const paystack = initializePaystack();
      const handler = paystack.inlinePay({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY, // public key on client
        email,
        amount: Math.round(amount * 100),
        reference,
        onSuccess: (response) => {
          // Optionally verify server-side
          onSuccess && onSuccess(response);
          // call verify endpoint to be safe
          axios.get(`https://egas-server.onrender.com/api/payments/verify/${response.reference}`).then(()=>console.log('verified'));
        },
        onClose: () => { console.log('closed') }
      });

      // open modal
      handler.openIframe();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Payment init failed');
    }
  };

  return <button onClick={handlePay}>Pay {amount} NGN</button>;
};

export default PayWithPaystack;
