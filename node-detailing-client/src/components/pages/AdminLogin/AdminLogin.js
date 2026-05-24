import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Alert, Button, Spinner } from 'react-bootstrap';
import {
  loginUser,
  getAuthError,
  getAuthLoading,
} from '../../../redux/authRedux';
import styles from './AdminLogin.module.scss';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Pobieramy statusy ładowania i błędów z Reduxa
  const error = useSelector(getAuthError);
  const loading = useSelector(getAuthLoading);

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { email, password };

    // Wywołujemy thunka logowania, po sukcesie lecimy do dashboardu
    dispatch(
      loginUser(credentials, () => {
        navigate('/admin-dashboard', { replace: true });
      }),
    );
  };

  return (
    <Container fluid className={styles.loginPage}>
      <Row className='justify-content-center align-items-center min-vh-100 px-3'>
        <Col sm={10} md={6} lg={4} className={styles.formContainer}>
          <h2 className={styles.heading}>NODE / SYSTEM ADMINISTRATION</h2>

          {error && (
            <Alert variant='danger' className='rounded-0 small'>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='ADMIN EMAIL'
                required
                disabled={loading}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='PASSWORD'
                required
                disabled={loading}
                className={styles.input}
              />
            </div>
            <Button
              type='submit'
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <Spinner animation='border' size='sm' />
              ) : (
                'ACCESS PANEL'
              )}
            </Button>
          </form>
          {/* DYSKRETNY POWRÓT DO STRONY GŁÓWNEJ */}
          <div className='text-center mt-4'>
            <Link to='/' className={styles.backLink}>
              ← BACK TO HOME
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;
