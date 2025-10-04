import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CustomerTestimonials from './components/CustomerTestimonials';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customer-testimonials" element={<CustomerTestimonials />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}