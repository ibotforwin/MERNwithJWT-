//useContext is for using hooks
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

//Logout service contains a logout call, which we will use directly for our onClick that signs users out
import AuthService from '../Services/AuthService';
import { AuthContext } from '../Context/AuthContext';

//We will be using functional components.
const Navbar = (props) => {
  //We are destructuring our useContext to get access to the global variables
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(
    AuthContext
  );

  //This onClickLogoutHandler users the AuthService logout call.
  //The logout function is a promise that should give us data, and then we can set the user to data.user and setIsAuthenticated to false.
  const onClickLogoutHandler = () => {
    AuthService.logout().then((data) => {
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(false);
      }
    });
  };

  //This is what will render if authenticated
  const authenticatedNavBar = () => {
    return (
      <>
        <Link to='/'>
          <li className='nav-item nav-link'>Home</li>
        </Link>

        <Link to='/todos'>
          <li className='nav-item nav-link'>Todos </li>
        </Link>

        {user.role === 'admin' ? (
          <Link to='/admin'>
            <li className='nav-item nav-link'>Admin</li>
          </Link>
        ) : null}

        <button
          type='button'
          className='btn btn-link nav-item nav-link'
          /* This onClick function is a custom function for logging users out. */
          onClick={onClickLogoutHandler}
        >
          Logout
        </button>
      </>
    );
  };

  //This is what will render if NOT authenticated
  const unauthenticatedNavBar = () => {
    return (
      <>
        <Link to='/'>
          <li className='nav-item nav-link'>Home</li>
        </Link>
        <Link to='/login'>
          <li className='nav-item nav-link'>Login</li>
        </Link>
        <Link to='/register'>
          <li className='nav-item nav-link'>Register</li>
        </Link>
      </>
    );
  };

  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-light bg-light'>
        <Link to='/'>
          <div className='navbar-brand'>NoobCoder</div>
        </Link>

        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav mr-auto'>
            {/* We will dynamically generate the list */}
            {/* We are checking if it is authenticated and will run the function depending on which it is */}
            {/* To do this, we will use the useContext hook which we imported */}
            {!isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
