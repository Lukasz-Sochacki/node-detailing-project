import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion'; // 1. DODAJEMY TEN IMPORT
import {
  fetchProjects,
  getProjectsByCategory,
  getIsLoading,
} from './redux/projectsRedux';

import IntroScreen from './components/views/IntroScreen/IntroScreen';
import Header from './components/views/Header/Header';
import ProjectFeed from './components/views/ProjectFeed/ProjectFeed';
import ContactForm from './components/views/ContactForm/ContactForm';
import AboutUs from './components/views/AboutUs/AboutUs';

const App = () => {
  const dispatch = useDispatch();
  const [showIntro, setShowIntro] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('ALL');

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
    <>
      {/* 2. OWIJAMY WARUNEK W ANIMATE PRESENCE */}
      <AnimatePresence mode='wait'>
        {showIntro ? (
          // Przesyłamy klucz key, aby AnimatePresence wiedział, kiedy komponent znika
          <IntroScreen key='intro' onComplete={() => setShowIntro(false)} />
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
                <ProjectFeed projects={filteredProjects} loading={isLoading} />
              )}
            </main>
            {!isLoading && <ContactForm />}
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
