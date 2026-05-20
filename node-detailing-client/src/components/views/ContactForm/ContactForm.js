import React, { useState } from 'react';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import { API_URL } from '../../../config';
import styles from './ContactForm.module.scss';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Stany informujące o statusie wysyłki
  const [status, setStatus] = useState(null); // 'success', 'error', 'loading'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');

    const payload = { name, email, message };

    // Strzał asynchroniczny POST do Twojego serwera NestJS
    fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || 'Validation failed');
          });
        }
        return res.json();
      })
      .then(() => {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch((err) => {
        setStatus('error');
        setErrorMsg(err.message || 'Something went wrong. Try again later.');
      });
  };

  return (
    <section className={styles.contactSection}>
      <Row className='justify-content-center px-3'>
        <Col md={8} lg={6}>
          <h2 className={styles.heading}>Request a quote / Contact us</h2>

          {status === 'success' && (
            <Alert variant='success' className='rounded-0 small'>
              Message sent successfully! We will contact you soon.
            </Alert>
          )}
          {status === 'error' && (
            <Alert variant='danger' className='rounded-0 small'>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='YOUR NAME'
                required
                disabled={status === 'loading'}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='YOUR EMAIL'
                required
                disabled={status === 'loading'}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='HOW CAN WE HELP YOU? (SPECIFICATION, MODEL DETAILS)'
                rows={5}
                required
                disabled={status === 'loading'}
                className={styles.textarea}
              />
            </div>

            <Button
              type='submit'
              disabled={status === 'loading'}
              className={styles.submitBtn}
            >
              {status === 'loading' ? 'SENDING...' : 'SUBMIT REQUEST'}
            </Button>
          </form>
        </Col>
      </Row>
    </section>
  );
};

export default ContactForm;
