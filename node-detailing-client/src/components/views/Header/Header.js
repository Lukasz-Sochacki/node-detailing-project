import React from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import styles from './Header.module.scss';

const Header = ({ currentCategory, onCategoryChange }) => {
  const menuItems = [
    'ALL',
    'INDUSTRIAL',
    'RESIDENTIAL',
    'COMMERCIAL',
    'EDUCATION',
    'ABOUT US',
  ];

  return (
    <header className={styles.header}>
      <Container
        fluid
        className='px-4 d-flex justify-content-between align-items-center'
      >
        <motion.div
          className={styles.logo}
          onClick={() => onCategoryChange('ALL')}
          layoutId='shared-logo'
          transition={{
            layout: {
              type: 'tween',
              duration: 1.8, // Zmieniamy na 1.8 sekundy, dopasowując do prędkości windy
              ease: [0.25, 1, 0.5, 1],
            },
          }}
        >
          NODE
        </motion.div>

        <motion.nav
          className={styles.nav}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
            delay: 1.0, // Menu pojawia się delikatnie w połowie trwania lotu i jazdy windy
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => onCategoryChange(item)}
              className={`${styles.navLink} ${currentCategory === item ? styles.active : ''}`}
            >
              {item}
            </button>
          ))}
        </motion.nav>
      </Container>
    </header>
  );
};

export default Header;
