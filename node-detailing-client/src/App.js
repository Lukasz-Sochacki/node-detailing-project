import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, getProjectsByCategory } from './redux/projectsRedux';

import IntroScreen from './components/views/IntroScreen/IntroScreen';
import Header from './components/views/Header/Header';

const App = () => {
  const dispatch = useDispatch();
  const [showIntro, setShowIntro] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('ALL');

  const filteredProjects = useSelector((state) =>
    getProjectsByCategory(state, currentCategory),
  );

  useEffect(() => {
    if (!showIntro) {
      dispatch(fetchProjects());
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

          <main className='container-fluid px-4 mt-5 text-center'>
            <p className='text-muted small'>
              Połączenie FullStack z NestJs i MySQL działa
            </p>
            <p className='lead'>
              Wybrana kategoria: <strong>{currentCategory}</strong> | Liczba
              odfiltrowanych projektów:{' '}
              <strong>{filteredProjects.length}</strong>
            </p>
          </main>
        </div>
      )}
    </>
  );
};

export default App;
