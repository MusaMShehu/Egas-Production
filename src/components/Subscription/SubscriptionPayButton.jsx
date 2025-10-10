import { usePaystackPayment } from '@paystack/inline-js';

const SubscriptionPayButton = ({ email, amount, metadata }) => {
  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
  
  const config = {
    email,
    amount: amount * 100, // Convert to kobo
    metadata,
    publicKey,
    reference: new Date().getTime().toString(),
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    initializePayment({
      onSuccess: (response) => {
        window.location.href = `/subscriptions/verify?reference=${response.reference}`;
      },
      onClose: () => {
        alert('Payment closed');
      },
    });
  };

  return (
    <button onClick={handlePayment} className="subscribe-button">
      Subscribe Now
    </button>
  );
};

export default SubscriptionPayButton;