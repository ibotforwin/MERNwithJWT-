import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

//We are destructuring the prop within the argument field. Component must be capitalized in react.
//We need the roles to determine routes
//The ...rest stores the remaining variables.
const UnPrivateRoute = (props) => {
  const { component: Component, ...rest } = props;
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        //Here we decide what to render
        //We will redirect based on isAUthenticated
        if (isAuthenticated)
          //The from field tells us where this user is coming from, the pathname is the redirect location.
          return (
            <Redirect
              to={{ pathname: '/home', state: { from: props.location } }}
            />
          );
        return <Component {...props} />;
      }}
    />
  );
};

export default UnPrivateRoute;
