import { API_URL } from '../config';

//selectors
export const getUser = (state) => state.auth.user;
export const getAuthLoading = (state) => state.auth.loading;
export const getAuthError = (state) => state.auth.error;

// actions
const createActionName = (actionName) => `app/auth/${actionName}`;
const START_REQUEST = createActionName('START_REQUEST');
const END_REQUEST = createActionName('END_REQUEST');
const ERROR_REQUEST = createActionName('ERROR_REQUEST');
const LOG_IN = createActionName('LOG_IN');
const LOG_OUT = createActionName('LOG_OUT');

// action creators
export const startRequest = () => ({ type: START_REQUEST });
export const endRequest = () => ({ type: END_REQUEST });
export const errorRequest = (payload) => ({ type: ERROR_REQUEST, payload });
export const logIn = (payload) => ({ type: LOG_IN, payload });
export const logOut = () => ({ type: LOG_OUT });

// thunk - asynchroniczne logowanie do NestJS
export const loginUser = (credentials, onSuccess) => {
  return (dispatch) => {
    dispatch(startRequest());
    // Kluczowe: wysyłamy credentials do bazy danych
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid email or password...');
        return res.json();
      })
      .then(() => {
        // Po udanym zalogowaniu zapisujemy informację o mailu w stanie
        dispatch(logIn({ email: credentials.email }));
        dispatch(endRequest());
        if (onSuccess) onSuccess(); //Przekierowanie do panelu
      })
      .catch((error) => {
        dispatch(errorRequest(error.message));
      });
  };
};

//Reducer
const authReducer = (
  statePart = { user: null, loading: false, error: null },
  action,
) => {
  switch (action.type) {
    case START_REQUEST:
      return { ...statePart, loading: true, error: null };
    case END_REQUEST:
      return { ...statePart, loading: false };
    case ERROR_REQUEST:
      return { ...statePart, loading: false, error: action.payload };
    case LOG_IN:
      return { ...statePart, user: action.payload };
    case LOG_OUT:
      return { ...statePart, user: null };
    default:
      return statePart;
  }
};

export default authReducer;
