// data/sampleData.js
export const userData = {
  id: 1001,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+2348012345678",
  dob: "1985-05-15",
  gender: "male",
  address: "123 Main Street, Lagos, Nigeria",
  profilePic: "https://via.placeholder.com/150",
  walletBalance: 15250,
  subscription: {
    active: true,
    type: "monthly",
    product: "12kg Cylinder",
    price: 10500,
    nextDelivery: "2023-05-25",
    status: "active"
  },
  recentOrders: [
    {
      id: "EG-1001",
      date: "2023-05-15",
      product: "12kg Gas Cylinder",
      quantity: 1,
      amount: 10500,
      status: "processing",
      deliveryDate: "2023-05-18",
      tracking: {
        status: "in-transit",
        location: "Lagos Distribution Center",
        progress: 60
      }
    },
    {
      id: "EG-0998",
      date: "2023-05-10",
      product: "6kg Gas Cylinder",
      quantity: 2,
      amount: 12000,
      status: "delivered",
      deliveryDate: "2023-05-12"
    }
  ],
  orderHistory: [
    {
      id: "EG-1001",
      date: "2023-05-15",
      product: "12kg Gas Cylinder",
      quantity: 1,
      amount: 10500,
      status: "processing"
    },
    {
      id: "EG-0998",
      date: "2023-05-10",
      product: "6kg Gas Cylinder",
      quantity: 2,
      amount: 12000,
      status: "delivered"
    },
    {
      id: "EG-0976",
      date: "2023-04-28",
      product: "12kg Gas Cylinder",
      quantity: 1,
      amount: 10500,
      status: "delivered"
    },
    {
      id: "EG-0954",
      date: "2023-04-15",
      product: "6kg Gas Cylinder",
      quantity: 1,
      amount: 6000,
      status: "delivered"
    }
  ],
  products: [
    {
      id: 1,
      name: "6kg Gas Cylinder",
      price: 6000,
      description: "Compact size ideal for small households or occasional use",
      image: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      name: "12kg Gas Cylinder",
      price: 10500,
      description: "Standard size perfect for average families",
      image: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      name: "25kg Gas Cylinder",
      price: 20000,
      description: "Large size for big families or commercial use",
      image: "https://via.placeholder.com/150"
    },
    {
      id: 4,
      name: "50kg Gas Cylinder",
      price: 38000,
      description: "Extra large for heavy commercial use",
      image: "https://via.placeholder.com/150"
    }
  ],
  subscriptionPlans: [
    {
      id: 1,
      name: "Basic Monthly",
      product: "6kg Cylinder",
      price: 6000,
      frequency: "monthly",
      savings: "Save ₦500 per refill"
    },
    {
      id: 2,
      name: "Standard Monthly",
      product: "12kg Cylinder",
      price: 10500,
      frequency: "monthly",
      savings: "Save ₦1,000 per refill"
    },
    {
      id: 3,
      name: "Premium Monthly",
      product: "25kg Cylinder",
      price: 20000,
      frequency: "monthly",
      savings: "Save ₦2,000 per refill"
    }
  ],
  transactions: [
    {
      id: "TX-1001",
      date: "2023-05-15",
      description: "Gas Order #EG-1001",
      amount: -10500,
      status: "completed",
      type: "debit"
    },
    {
      id: "TX-0998",
      date: "2023-05-10",
      description: "Gas Order #EG-0998",
      amount: -12000,
      status: "completed",
      type: "debit"
    },
    {
      id: "TX-0997",
      date: "2023-05-08",
      description: "Wallet Top Up",
      amount: 20000,
      status: "completed",
      type: "credit"
    },
    {
      id: "TX-0976",
      date: "2023-04-28",
      description: "Gas Order #EG-0976",
      amount: -10500,
      status: "completed",
      type: "debit"
    }
  ],
  tickets: [
    {
      id: "TCK-1001",
      subject: "Delivery delay",
      category: "delivery",
      status: "open",
      date: "2023-05-16",
      lastUpdated: "2023-05-16"
    },
    {
      id: "TCK-0998",
      subject: "Payment issue",
      category: "payment",
      status: "resolved",
      date: "2023-04-10",
      lastUpdated: "2023-04-12"
    }
  ],
  notifications: [
    {
      id: 1,
      title: "Order Shipped",
      message: "Your order #EG-1001 has been shipped and is on its way",
      date: "2023-05-16",
      read: false,
      type: "order"
    },
    {
      id: 2,
      title: "Subscription Renewal",
      message: "Your monthly subscription will renew in 3 days",
      date: "2023-05-22",
      read: false,
      type: "subscription"
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Your wallet top up of ₦20,000 has been processed",
      date: "2023-05-08",
      read: true,
      type: "payment"
    }
  ],
  sessions: [
    {
      id: 1,
      device: "Chrome on Windows",
      ip: "192.168.1.1",
      location: "Lagos, Nigeria",
      lastActive: "Active now"
    },
    {
      id: 2,
      device: "Safari on iPhone",
      ip: "192.168.1.2",
      location: "Lagos, Nigeria",
      lastActive: "2 hours ago"
    }
  ]
};