import { API_URL } from '../config';

//selectors
export const getAllProjects = (state) => state.projects.data || [];
// Filtrowanie z uwzględnieniem nowej ścieżki dostępu state.projects.data
export const getProjectsByCategory = ({ projects }, category) => {
  // Wyciągamy tablicę z klucza .data obiektu pod-stanu projects
  const projectsList = projects.data || [];

  if (projectsList.length === 0) return [];

  return category === 'ALL'
    ? projectsList
    : projectsList.filter((project) => project.category === category);
};
export const getIsLoading = (state) => state.projects.loading;

//actions
const createActionName = (actionName) => `api/projects/${actionName}`;
const UPDATE_PROJECTS = createActionName('UPDATE_PROJECTS');
const START_REQUEST = createActionName('START_REQUEST');
const END_REQUEST = createActionName('END_REQUEST');
const ERROR_REQUEST = createActionName('ERROR_REQUEST');
const REMOVE_PROJECT = createActionName('REMOVE_PROJECT');
const ADD_PROJECT = createActionName('ADD_PROJECT');

// action creators
export const startRequest = () => ({ type: START_REQUEST });
export const endRequest = () => ({ type: END_REQUEST });
export const errorRequest = (payload) => ({ type: ERROR_REQUEST, payload });
export const updateProjects = (payload) => ({ type: UPDATE_PROJECTS, payload });
export const removeProject = (payload) => ({ type: REMOVE_PROJECT, payload });
export const addProject = (payload) => ({ type: ADD_PROJECT, payload });

//thunk - asynchroniczne pobieranie danych z NESTJs
export const fetchProjects = () => {
  return (dispatch) => {
    dispatch(startRequest()); // 1. Informujemy aplikację, że zaczynamy ładować
    fetch(API_URL + '/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((projects) => {
        dispatch(updateProjects(projects)); // 2. Zapisujemy dane
        dispatch(endRequest()); // 3. Konczymy ładowanie
      })
      .catch((error) => {
        dispatch(errorRequest(error.message));
        console.error('Error fetching projects:', error);
      });
  };
};

export const deleteProjectRequest = (id) => {
  return (dispatch) => {
    //Wysyłamy zapytanie DELETE
    fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete project from server...');
        return res.json();
      })
      .then(() => {
        // Po sukcesie na serwerze, usuwamy projekt ze stanu globalnego w React
        dispatch(removeProject(id));
      })
      .catch((error) => console.error('Error deleting project:', error));
  };
};

export const addProjectRequest = (formData, onSuccess) => {
  return (dispatch) => {
    fetch(`${API_URL}/projects`, {
      method: 'POST',
      // WAŻNE: Przy przesyłaniu FormData NIE ustawiamy nagłówka 'Content-Type'.
      // Przeglądarka zrobi to automatycznie i doda odpowiedni klucz boundary!
      credentials: 'include', // Przesyłamy ciasteczko sesyjne z tokenem JWT admina
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to add project to MySQL...');
        return res.json();
      })
      .then((newProject) => {
        // Dodajemy nowo utworzony projekt z bazy MySQL bezpośrednio do stanu Redux
        dispatch(addProject(newProject));
        if (onSuccess) onSuccess(); // Czyścimy formularz w komponencie
      })
      .catch((error) => console.error('Error adding project:', error));
  };
};

const projectsReducer = (
  statePart = { data: [], loading: false, error: null },
  action,
) => {
  switch (action.type) {
    case START_REQUEST:
      return { ...statePart, loading: true, error: null };
    case END_REQUEST:
      return { ...statePart, loading: false };
    case ERROR_REQUEST:
      return { ...statePart, loading: false, error: action.payload };
    case UPDATE_PROJECTS:
      return { ...statePart, data: [...action.payload] };
    case REMOVE_PROJECT:
      return {
        ...statePart,
        data: statePart.data.filter((project) => project.id !== action.payload),
      };
    case ADD_PROJECT:
      return {
        ...statePart,
        data: [...statePart.data, action.payload], // Doklejamy nowy obiekt na koniec tablicy
      };
    default:
      return statePart;
  }
};

export default projectsReducer;
