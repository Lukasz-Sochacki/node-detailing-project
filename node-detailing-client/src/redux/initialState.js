const savedUser = localStorage.getItem('admin_user')
  ? JSON.parse(localStorage.getItem('admin_user'))
  : null;

const initialState = {
  projects: {
    data: [],
    loading: true, // Domyślnie startujemy ze statusem ładowania
    error: null,
  },
  auth: {
    user: savedUser, // ZMIANA: Wstrzykujemy zapisanego użytkownika od razu przy starcie sklepu!
    loading: false,
    error: null,
  },
};

export default initialState;
