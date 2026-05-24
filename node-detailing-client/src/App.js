import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion'; // 1. DODAJEMY TEN IMPORT
import {
  fetchProjects,
  getProjectsByCategory,
  getIsLoading,
} from './redux/projectsRedux';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

import IntroScreen from './components/views/IntroScreen/IntroScreen';
import Header from './components/views/Header/Header';
import ProjectFeed from './components/views/ProjectFeed/ProjectFeed';
import ContactForm from './components/views/ContactForm/ContactForm';
import AboutUs from './components/views/AboutUs/AboutUs';
import AdminLogin from './components/pages/AdminLogin/AdminLogin'; // Widok logowania
import AdminDashboard from './components/pages/AdminDashboard/AdminDashboard'; // Widok panelu
import { getUser } from './redux/authRedux';

const App = () => {
  const dispatch = useDispatch();
  const [showIntro, setShowIntro] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('ALL');

  // Pobieramy dane o zalogowanym użytkowniku (siostrze) z Reduxa
  const user = useSelector(getUser);
  const filteredProjects = useSelector((state) =>
    getProjectsByCategory(state, currentCategory),
  );
  const isLoading = useSelector(getIsLoading);

  useEffect(() => {
    if (!showIntro) {
      const fetchTimer = setTimeout(() => {
        dispatch(fetchProjects());
      }, 1500);
      return () => clearTimeout(fetchTimer);
    }
  }, [dispatch, showIntro]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ŚCIEŻKA PUBLICZNA: Główna strona wizerunkowa z Twoją filmową animacją */}
        <Route
          path='/'
          element={
            <AnimatePresence mode='wait'>
              {showIntro ? (
                <IntroScreen
                  key='intro'
                  onComplete={() => setShowIntro(false)}
                />
              ) : (
                <div
                  key='content'
                  style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}
                >
                  <Header
                    currentCategory={currentCategory}
                    onCategoryChange={setCurrentCategory}
                  />

                  <main className='container-fluid px-0'>
                    {currentCategory === 'ABOUT US' ? (
                      <AboutUs />
                    ) : (
                      <ProjectFeed
                        projects={filteredProjects}
                        loading={isLoading}
                      />
                    )}
                  </main>
                  {!isLoading && <ContactForm />}
                  {/* DYSKRETNY ODNOŚNIK DLA SIOSTRY NA SAMYM DOLE STRONY */}
                  {!isLoading && (
                    <footer
                      className='text-center py-4'
                      style={{ borderTop: '1px solid rgba(17, 17, 17, 0.05)' }}
                    >
                      <Link
                        to='/admin-login'
                        style={{
                          color: '#777777',
                          fontFamily: 'Helvetica Neue, Arial',
                          fontSize: '0.7rem',
                          letterSpacing: '2px',
                          textDecoration: 'none',
                          fontWeight: '700',
                        }}
                        className='admin-foot-link'
                      >
                        NODE / ADMIN ACCESS
                      </Link>
                    </footer>
                  )}
                </div>
              )}
            </AnimatePresence>
          }
        />
        {/* ŚCIEŻKA UKRYTA: Formularz logowania administratora. Jeśli siostra jest już zalogowana, przekieruje ją do panelu */}
        <Route
          path='/admin-login'
          element={
            user ? <Navigate to='/admin-dashboard' replace /> : <AdminLogin />
          }
        />
        <Route
          path='/admin-dashboard'
          element={
            user ? <AdminDashboard /> : <Navigate to='/admin-login' replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
