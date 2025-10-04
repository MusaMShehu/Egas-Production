import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import RestaurantSolutions from './components/RestaurantSolutions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant-solutions" element={<RestaurantSolutions />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}