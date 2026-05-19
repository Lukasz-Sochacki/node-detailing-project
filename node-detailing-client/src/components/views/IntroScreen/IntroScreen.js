import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './IntroScreen.module.scss';

const IntroScreen = ({ onComplete }) => {
  useEffect(() => {
    // Ekran znika dopiero po 2.2 sekundy, dając logu czas na zaparkowanie w rogu
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className={styles.container}
      initial={{ backgroundColor: '#F5F5DC' }}
      animate={{ backgroundColor: '#FFFFFF' }}
      transition={{ duration: 1.5, delay: 0.4 }}
    >
      <motion.div
        className={styles.logo}
        layoutId='shared-logo' // Łącznik dwóch komponentów
        transition={{
          type: 'tween', // WYŁĄCZENIE SPRĘŻYNY: Wymuszamy płynny ruch czasowy
          duration: 2.8, // Dokładnie 2.8 sekundy dostojnego, wolnego lotu
          ease: [0.25, 1, 0.5, 1], // Przepiękne, łagodne wyhamowanie na końcu podróży
        }}
      >
        NODE
      </motion.div>
    </motion.div>
  );
};

export default IntroScreen;
