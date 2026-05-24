import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Tab } from 'react-bootstrap';
import {
  fetchProjects,
  getAllProjects,
  getIsLoading,
} from '../../../redux/projectsRedux';
import { logOut, getUser } from '../../../redux/authRedux';
import styles from './AdminDashboard.module.scss';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Pobieramy dane ze stanów globalnych Redux
  const projects = useSelector(getAllProjects);
  const isLoading = useSelector(getIsLoading);
  const user = useSelector(getUser);

  //Upewniamy się, że projekty są aktualne i pobrane z bazy MySQL
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
      console.log('Requesting deletion for project ID:', id);
      //Tutaj w kolejnym kroku wepniemy asynchroniczną akcję usuwania z bazy danych
    }
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
                  <td className={styles.imgCell}>
                    <img
                      src={project.mainImage}
                      alt=''
                      className={styles.tableThmb}
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
