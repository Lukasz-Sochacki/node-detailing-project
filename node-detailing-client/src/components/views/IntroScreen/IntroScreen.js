import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './IntroScreen.module.scss';

const IntroScreen = ({ onComplete }) => {
  useEffect(() => {
    // Trzymamy logo na środku beżu przez 1.2 sekundy, po czym odpalamy zmianę stanu w App.js
    const timer = setTimeout(() => {
      onComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className={styles.container}
      // POPRAWKA: Jawnie definiujemy pozycję startową i trzymanie pozycji w tekście
      initial={{ y: '0vh' }}
      animate={{ y: '0vh' }}
      exit={{ y: '-100vh' }} // Winda rusza pionowo w kosmos po wywołaniu onComplete
      transition={{
        type: 'tween',
        duration: 1.8, // Winda jedzie dostojnie przez 1.8 sekundy
        ease: [0.76, 0, 0.24, 1], // Kultowa, płynna krzywa przesunięcia ze strony BIG
      }}
    >
      <motion.div
        className={styles.logo}
        layoutId='shared-logo'
        transition={{
          type: 'tween',
          duration: 1.8, // Lot napisu trwa dokładnie tyle samo co jazda windy
          ease: [0.25, 1, 0.5, 1],
        }}
      >
        NODE
      </motion.div>
    </motion.div>
  );
};

export default IntroScreen;
