const initialState = {
  projects: {
    data: [],
    loading: true, // Domyślnie startujemy ze statusem ładowania
    error: null,
  },
  auth: {
    user: null,
    loading: false,
    error: null,
  },
};

export default initialState;
