import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ConfirmationModal } from './components/ui/Modal';
import { PhotoAlbumList } from './components/PhotoAlbumList';
import { Gallery } from './components/Gallery';
import AppProvider from './context/AppProvider';
import { Loader } from './components/ui/Loader';
import { ErrorMsg } from './components/ui/ErrorMsg';
import { Login } from './components/Login';
import { PrivateRoute } from './PrivateRoute';
import { Header } from './components/Header';
import { AdminNavBar } from './components/ui/AdminNavBar';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Header />
        <AdminNavBar />
        <div className="flex-grow p-10">
          <Routes>
            <Route path="/login" Component={Login} />
            <Route
              path="/"
              element={<PrivateRoute component={PhotoAlbumList} />}
            />
            <Route path="/gallery/:id" Component={Gallery} />
          </Routes>
          <Loader />
          <ErrorMsg />
        </div>
      </Router>
      <ConfirmationModal />
    </AppProvider>
  );
}
