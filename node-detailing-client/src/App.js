import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
      // Wstrzymujemy start pobierania o 3.2 sekundy od momentu zniknięcia intro
      const fetchTimer = setTimeout(() => {
        dispatch(fetchProjects());
      }, 2500);
      // Klasyczne czyszczenie licznika z Kodilli przy odmontowywaniu komponentu
      return () => clearTimeout(fetchTimer);
    }
  }, [dispatch, showIntro]);

  return (
    <>
      {showIntro ? (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      ) : (
        <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
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
    </>
  );
};

export default App;
