import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ModalProvider } from './context/modalContext';
import { ConfirmationModal } from './components/ui/Modal';
import { PhotoAlbumList } from './components/PhotoAlbumList';
import { Gallery } from './components/Gallery';

export default function App() {
  return (
    <ModalProvider>
      <Router>
        <Routes>
          <Route path="/" Component={PhotoAlbumList} />
          <Route path="/gallery/:id" Component={Gallery} />
        </Routes>
      </Router>
      <ConfirmationModal />
    </ModalProvider>
  );
}
