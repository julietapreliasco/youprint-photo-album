import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ConfirmationModal } from './components/ui/Modal';
import { PhotoAlbumList } from './components/PhotoAlbumList';
import { Gallery } from './components/Gallery';
import AppProvider from './context/AppProvider';
import { Loader } from './components/ui/Loader';
import { ErrorMsg } from './components/ui/ErrorMsg';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" Component={PhotoAlbumList} />
          <Route path="/gallery/:id" Component={Gallery} />
        </Routes>
      </Router>
      <ConfirmationModal />
      <Loader />
      <ErrorMsg />
    </AppProvider>
  );
}
