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
} from '../../../redux/projectsRedux';
import { logOut, getUser } from '../../../redux/authRedux';
import styles from './AdminDashboard.module.scss';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const projects = useSelector(getAllProjects);
  const isLoading = useSelector(getIsLoading);
  const user = useSelector(getUser);

  // Stany formularza dla nowej pozycji portfolio
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('INDUSTRIAL');
  const [file, setFile] = useState(null); // Stan trzymający wybrany plik z dysku

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
    setFile(e.target.files[0]); // Przechwytujemy pierwszy wybrany plik z okna systemowego
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!file) return alert('Please select an image file first!');

    // BUDUJEMY FORMDATA - niezbędne do przesyłania plików binarnych przez sieć
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('file', file); // Wstrzykujemy plik binarny

    //Wywołujemy akcję zapisu w Reduxie
    dispatch(
      addProjectRequest(formData, () => {
        setTitle('');
        setFile(null);
        //Resetujemy pole pliku w kodzie HTML
        document.getElementById('fileInput').value = '';
      }),
    );
  };

  return (
    <Container className={styles.dashboardPage}>
      <header className={styles.header}>
        <div>
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
        <Form onSubmit={handleAddProject} className={styles.addForm}>
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
                {/* ZMIANA: Prawdziwe okno załączania pliku graficznego z dysku */}
                <Form.Control
                  id='fileInput'
                  type='file'
                  accept='image/*' //Akceptujemy wyłącznie pliki graficzne
                  onChange={handleFileChange}
                  required
                  className={styles.customInput}
                />
                <Form.Text className='text-muted small px-1'>
                  Select model screenshot from your hard drive
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button type='submit' className={styles.addBtn}>
                ADD ITEM
              </Button>
            </Col>
          </Row>
        </Form>
      </section>

      {/* SEKCJA 2: TABELA Z LISTĄ OBECNYCH PROJEKTÓW */}
      <section className={styles.tableSection}>
        <h2 className={styles.sectionHeading}>
          Current Portfolio Items ({projects.length})
        </h2>
        {isLoading ? (
          <p className='text-muted'>Loading database items...</p>
        ) : (
          <Table responsive className={styles.customTable}>
            <thead>
              <tr>
                <th>PREVIEW</th>
                <th>PROJECT TITLE</th>
                <th>CATEGORY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  {/* LITERÓWKA NAPRAWIONA: Było imgCell, zsynchronizowano z klasą w SCSS */}
                  <td className={styles.imgCell}>
                    <img
                      src={project.mainImage}
                      alt=''
                      /* LITERÓWKA NAPRAWIONA: Było tableThmb, zmieniono na pełne tableThumb z Twojego SCSS */
                      className={styles.tableThumb}
                    />
                  </td>
                  <td className={styles.titleCell}>{project.title}</td>
                  <td className={styles.categoryCell}>{project.category}</td>
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
