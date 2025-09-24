import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MaintenanceServices from './components/MaintenanceServices';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/maintenance-services" element={<MaintenanceServices />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}