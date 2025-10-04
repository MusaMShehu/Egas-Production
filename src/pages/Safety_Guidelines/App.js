import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SafetyGuidelines from './components/SafetyGuidelines';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}