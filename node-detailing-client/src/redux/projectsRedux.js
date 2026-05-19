import { API_URL } from '../config';

//selectors
export const getAllProjects = (state) => state.projects;
export const getProjectsByCategory = ({ projects }, category) =>
  category === 'ALL'
    ? projects
    : projects.filter((project) => project.category === category);

//actions
const createActionName = (actionName) => `api/projects/${actionName}`;
const UPDATE_PROJECTS = createActionName('UPDATE_PROJECTS');

//action creators
export const updateProjects = (payload) => ({ type: UPDATE_PROJECTS, payload });

//thunk - asynchroniczne pobieranie danych z NESTJs
export const fetchProjects = () => {
  return (dispatch) => {
    fetch(API_URL + '/projects')
      .then((res) => res.json())
      .then((projects) => dispatch(updateProjects(projects)))
      .catch((error) => console.error('Error fetching projects:', error));
  };
};

const projectsReducer = (statePart = [], action) => {
  switch (action.type) {
    case UPDATE_PROJECTS:
      return [...action.payload];
    default:
      return statePart;
  }
};

export default projectsReducer;
