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

// action creators
export const startRequest = () => ({ type: START_REQUEST });
export const endRequest = () => ({ type: END_REQUEST });
export const errorRequest = (payload) => ({ type: ERROR_REQUEST, payload });
export const updateProjects = (payload) => ({ type: UPDATE_PROJECTS, payload });

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
    default:
      return statePart;
  }
};

export default projectsReducer;
