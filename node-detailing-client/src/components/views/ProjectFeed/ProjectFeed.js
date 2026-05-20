import React from 'react';
import { Row, Col } from 'react-bootstrap';
import styles from './ProjectFeed.module.scss';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectFeed = ({ projects, loading }) => {
  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <motion.div
          className={styles.spinner}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: 'linear',
          }}
        />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className={styles.noProjects}>
        No projects available in this category yet.
      </div>
    );
  }
  return (
    <div className={styles.feed}>
      {/* AnimatePresence pilnuje płynnych przejść podczas filtrowania kategorii */}
      <AnimatePresence mode='wait'>
        {projects.map((project) => (
          <motion.div
            key={project.id}
            // EFEKT FADE-IN: Animujemy opacity oraz delikatny ruch z dołu do góry (y)
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 1.2, // Wolne, dostojne wyłanianie przez 1.2 sekundy
              ease: [0.25, 1, 0.5, 1], // Super płynne wyhamowanie
            }}
          >
            <Row key={project.id} className='mb-5 justify-content-center'>
              <Col md={10} lg={8}>
                <div className={styles.projectCard}>
                  {/* Kontener na wielkie zdjęcie modelu 3D */}
                  <div className={styles.imageWrapper}>
                    <img
                      src={project.mainImage}
                      alt={project.title}
                      className={styles.image}
                      // Tymczasowe zabezpieczenie, gdyby obrazek się nie załadował
                      onError={(e) => {
                        e.target.src =
                          'https://placehold.co/1200x675/F5F5DC/111111?text=NODE+DETAILING';
                      }}
                    />
                  </div>

                  {/* Surowa, minimalistyczna linia i metadane projektu */}
                  <div className={styles.details}>
                    <h2 className={styles.title}>{project.title}</h2>
                    <span className={styles.category}>{project.category}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProjectFeed;
