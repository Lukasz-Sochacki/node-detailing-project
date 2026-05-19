import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './IntroScreen.module.scss';

const IntroScreen = ({ onComplete }) => {
  useEffect(() => {
    // Odliczamy 2.5 sekundy, po czym kończymy animację i przechodzimy do strony głównej
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return (
    <motion.div
      className={styles.container}
      initial={{ backgroundColor: '#F5F5DC' }} // Startujemy z beżowego tła siostry
      animate={{ backgroundColor: '#FFFFFF' }} // Płynnie przechodzimy na białe tło strony
      transition={{ duration: 1.5, delay: 0.8 }}
    >
      <motion.div
        className={styles.logo}
        initial={{ scale: 1, x: 0, y: 0 }}
        animate={{
          scale: 0.45, // Logo zmniejsza się do rozmiaru logotypu w menu
          x: '-42vw', // Leci do lewej krawędzi (wartość dostosowana do ekranu)
          y: '-44vh', // Leci do górnej krawędzi
        }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: 0.6 }}
      >
        NODE
      </motion.div>
    </motion.div>
  );
};

export default IntroScreen;
