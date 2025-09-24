import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PricingPlans from './components/PricingPlans';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing-plans" element={<PricingPlans />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}