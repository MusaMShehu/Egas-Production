import { PaystackButton } from 'react-paystack';

const SubscriptionPayButton = ({ email, amount, metadata }) => {
  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
  const reference = new Date().getTime().toString();

  const props = {
    email,
    amount: amount * 100,
    metadata,
    publicKey,
    text: 'Subscribe Now',
    reference,
    onSuccess: (response) => {
      window.location.href = `/subscriptions/verify?reference=${response.reference}`;
    },
    onClose: () => alert('Payment closed'),
  };

  return <PaystackButton {...props} />;
};

export default SubscriptionPayButton;
