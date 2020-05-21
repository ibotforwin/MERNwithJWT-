import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthProvider from './Context/AuthContext';

ReactDOM.render(
  //In create the AuthProvider, we provided four global variables.
  //We are now wrapping the App component within the AuthProvider to give it access to those four global variables.
  //The variables in AuthProvider are: user, setUser, isAuthenticated, setIsAuthenticated
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);
