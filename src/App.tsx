import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Gallery from './components/Gallery';
import { ModalProvider } from './context/modalContext';
import ConfirmationModal from './components/ui/Modal';

export default function App() {
  return (
    <ModalProvider>
    <Router>
      <Routes>
      <Route path="/gallery/:id" element={<Gallery />} />
      </Routes>
    </Router>
    <ConfirmationModal />
    </ModalProvider>
  );
}