import React from 'react';
import { Row, Col } from 'react-bootstrap';
import styles from './AboutUs.module.scss';

const AboutUs = () => {
  return (
    <section className={styles.aboutSection}>
      <Row className='justify-content-center px-3'>
        <Col md={10} lg={8} className='text-start'>
          <h2 className={styles.heading}>About Node Detailing</h2>
          <p className={styles.leadText}>
            Based in Australia, Node is a premier structural detailing company
            specializing in high-quality steel structures. We bridge the gap
            between engineering design and structural fabrication with surgical
            precision.
          </p>
          <p className={styles.bodyText}>
            Our team delivers fabrication shop drawings, 3D modeling, and
            advanced structural detailing across Industrial, Residential,
            Commercial, and Educational sectors. Using cutting-edge technology,
            we ensure seamless execution for every project, regardless of
            complexity.
          </p>
        </Col>
      </Row>
    </section>
  );
};

export default AboutUs;
