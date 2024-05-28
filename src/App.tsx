import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Gallery from './components/Gallery';

export default function App() {
  return (
    <Router>
      <Routes>
      <Route path="/gallery/:id" element={<Gallery />} />
      </Routes>
    </Router>
  );
}