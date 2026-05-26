import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import {
  fetchProjects,
  getAllProjects,
  getIsLoading,
  deleteProjectRequest,
  addProjectRequest,
  moveProjectUpRequest,
  moveProjectDownRequest,
} from '../../../redux/projectsRedux';
import { logOut, getUser } from '../../../redux/authRedux';
import styles from './AdminDashboard.module.scss';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const projects = useSelector(getAllProjects);
  const isLoading = useSelector(getIsLoading);
  const user = useSelector(getUser);

  // Stany formularza
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('INDUSTRIAL');
  const [file, setFile] = useState(null); // Przechowuje czysty, pojedynczy plik
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/admin-login');
  };

  const handleDeleteProject = (id) => {
    if (
      window.confirm(
        'Are you sure you want to permanently delete this project from MySQL database?',
      )
    ) {
      dispatch(deleteProjectRequest(id));
    }
  };

  const handleFileChange = (e) => {
    // Sprawdzamy, czy tablica plików w ogóle istnieje i czy ma przynajmniej 1 element
    if (e.target.files && e.target.files.length > 0) {
      // JAWNA POPRAWKA: Przypisujemy do stanu czysty, pojedynczy plik z indeksem 0
      setFile(e.target.files[0]);
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!file) return alert('Please select an image file first!');
    setError(null);

    // Walidacja wagi na frontendzie (1MB = 1048576 bajtów)
    if (file.size > 1048576) {
      setError('File is too heavy! Maximum allowed size is 1MB.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', file);

    dispatch(
      addProjectRequest(
        formData,
        () => {
          setTitle('');
          setFile(null);
          document.getElementById('fileInput').value = '';
        },
        (errorMessage) => {
          setError(errorMessage);
        },
      ),
    );
  };

  return (
    <Container className={styles.dashboardPage}>
      <header className={styles.header}>
        <div>
          {/* LINK POWROTU NAD TYTUŁEM PANELU */}
          <div className='mb-2'>
            <Link to='/' className={styles.backToHome}>
              ← BACK TO MAIN SITE
            </Link>
          </div>
          <h1 className={styles.title}>NODE CONTROL PANEL</h1>
          <p className={styles.subTitle}>
            Logged in as: <strong>{user?.email}</strong>
          </p>
        </div>
        <Button onClick={handleLogout} className={styles.logoutBtn}>
          LOG OUT
        </Button>
      </header>

      {/* SEKCJA 1: FORMULARZ DODAWANIA PROJEKTÓW */}
      <section className={styles.formSection}>
        <h2 className={styles.sectionHeading}>Add New Project to Portfolio</h2>
        {error && (
          <div className='alert alert-danger rounded-0 small mb-4'>{error}</div>
        )}
        <form onSubmit={handleAddProject} className={styles.addForm}>
          <Row className='align-items-end g-4'>
            <Col md={4}>
              <Form.Group>
                <Form.Control
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='PROJECT TITLE'
                  required
                  className={styles.customInput}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={styles.customSelect}
                >
                  <option value='INDUSTRIAL'>INDUSTRIAL</option>
                  <option value='RESIDENTIAL'>RESIDENTIAL</option>
                  <option value='COMMERCIAL'>COMMERCIAL</option>
                  <option value='EDUCATION'>EDUCATION</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Control
                  id='fileInput'
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  required
                  className={styles.customInput}
                />
                <Form.Text className='text-muted small px-1'>
                  Select model screenshot
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button type='submit' className={styles.addBtn}>
                ADD ITEM
              </Button>
            </Col>
          </Row>
        </form>
      </section>

      {/* SEKCJA 2: TABELA Z LISTĄ OBECNYCH PROJEKTÓW */}
      <section className={styles.tableSection}>
        <h2 className={styles.sectionHeading}>
          Current Portfolio Items ({projects.length})
        </h2>
        {isLoading && projects.length === 0 ? (
          <p className='text-muted'>Loading database items...</p>
        ) : (
          <Table responsive className={styles.customTable}>
            <thead>
              <tr>
                <th>PREVIEW</th>
                <th>PROJECT TITLE</th>
                <th>CATEGORY</th>
                <th className='text-center'>ORDER</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project.id}>
                  <td className={styles.imgCell}>
                    <img
                      src={project.mainImage}
                      alt=''
                      className={styles.tableThumb}
                    />
                  </td>
                  <td className={styles.titleCell}>{project.title}</td>
                  <td className={styles.categoryCell}>{project.category}</td>

                  {/* KOLUMNA STRZAŁEK KOLEJNOŚCI */}
                  <td className='text-center'>
                    <div className={styles.orderActions}>
                      <Button
                        disabled={index === 0}
                        onClick={() =>
                          dispatch(moveProjectUpRequest(project.id))
                        }
                        className={styles.orderBtn}
                      >
                        ↑
                      </Button>
                      <Button
                        disabled={index === projects.length - 1}
                        onClick={() =>
                          dispatch(moveProjectDownRequest(project.id))
                        }
                        className={styles.orderBtn}
                      >
                        ↓
                      </Button>
                    </div>
                  </td>

                  <td>
                    <Button
                      onClick={() => handleDeleteProject(project.id)}
                      className={styles.deleteBtn}
                    >
                      DELETE
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>
    </Container>
  );
};

export default AdminDashboard;
