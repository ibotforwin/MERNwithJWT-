import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../Services/AuthService';

//This will give us a provider and a consumer.
//Provider: Has access to global state.
//Consumer: Has access to consuming global state.
export const AuthContext = createContext();

//This function will have props. We are deconstructing it to children in order to have components that the Provider wraps around.
export default ({ children }) => {
  //This will be used for hooks
  //Used for maintaining state in a functional component

  //Intialize user to null
  //Set using setUser
  const [user, setUser] = useState(null);

  //Initialize to false
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //Initialize to false
  const [isLoaded, setIsLoaded] = useState(false);

  //This is a hook version of component did mount (I think that means it loaded)
  useEffect(() => {
    AuthService.isAuthenticated().then((data) => {
      //Once these two are done, the application has loaded.
      setUser(data.user);
      setIsAuthenticated(data.isAuthenticated);

      //Now we set isLoaded to true
      setIsLoaded(true);
    });
    //The ,[] is used to make sure it is only used once.
  }, []);

  //Once loaded is done, this is what happens next (return)
  return (
    <div>
      {/* This will check if page is loaded. Once it is loaded, we are using the AuthContext.Provider to pass variables that 
    we want to be global. In this case, we want the user object, as well as the setUser in case we want to make changes
    and the authentication state and setter. */}
      {/* This is called wrapping the AuthContext provider around our children components. */}
      {!isLoaded ? (
        <h1>Loading</h1>
      ) : (
        <AuthContext.Provider
          value={{ user, setUser, isAuthenticated, setIsAuthenticated }}
        >
          {children}
        </AuthContext.Provider>
      )}
    </div>
  );
};

//We will proceed to use this in index.js
