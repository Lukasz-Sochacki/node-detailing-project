import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, getProjectsByCategory } from './redux/projectsRedux';

// Komponenty widoków, które stworzymy w kolejnych krokach
import IntroScreen from './components/views/IntroScreen/IntroScreen';
import Header from './components/views/Header/Header';

const App = () => {
  const dispatch = useDispatch();

  // Stan kontrolujący ekran powitalny
  const [showIntro, setShowIntro] = useState(true);
  // Stan aktywnej kategorii projektów (ALL, INDUSTRIAL, RESIDENTIAL itp.)
  const [currentCategory, setCurrentCategory] = useState('All');
  // Selektor z Reduxa, który automatycznie odfiltruje nam projekty w locie
  const filteredProjects = useSelector((state) => {
    getProjectsByCategory(state, currentCategory);
  });
  // Pobieramy dane z bazy MySQL przez serwer NestJS zaraz po zakończeniu intro
  useEffect(() => {
    if (!showIntro) {
      dispatch(fetchProjects());
    }
  }, [dispatch, showIntro]);
  return (
    <>
      {showIntro ? (
        // Ekran startowy - przesyłamy funkcję zamykającą intro jako prop
        <IntroScreen onComplete={() => setShowIntro(false)} />
      ) : (
        // Główna struktura strony po zakończeniu animacji powitalnej
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
