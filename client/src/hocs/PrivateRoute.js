import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

//We are destructuring the prop within the argument field. Component must be capitalized in react.
//We need the roles to determine routes
//The ...rest stores the remaining variables.
const PrivateRoute = (props) => {
  const { component: Component, roles, ...rest } = props;
  const { isAuthenticated, user } = useContext(AuthContext);
  console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
  console.log(props);

  return (
    <Route
      {...rest}
      render={(props) => {
        //Here we decide what to render
        //We will redirect based on isAUthenticated
        if (!isAuthenticated)
          //The from field tells us where this user is coming from, the pathname is the redirect location.
          return (
            <Redirect
              to={{ pathname: '/login', state: { from: props.location } }}
            />
          );

        if (!roles.includes(user.role))
          return (
            <Redirect to={{ pathname: '/', state: { from: props.location } }} />
          );
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
