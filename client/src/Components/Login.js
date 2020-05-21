//Importing two hooks. useState and useContext
import React, { useState, useContext } from 'react';

//Authentication
import AuthService from '../Services/AuthService';

//Helper component that displays the message from server
import Message from '../Components/Message';

//Authentication (useContext) argument which is our "global state"
import { AuthContext } from '../Context/AuthContext';

const Login = (props) => {
  //First let's set out states with their default states
  const [user, setUser] = useState({ username: '', password: '' });
  const [message, setMessage] = useState(null);

  //This is our global variable holder
  const authContext = useContext(AuthContext);

  const onChange = (e) => {
    // The ...user copies the existing properties of user. The e.target.name : e.target.value updates the object to the data that is being input by the user.
    //I believe this allows dynamic updating of the object before it is submitted.
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    //We will be using the AuthService here
    //The AuthService returns a promise, so we will do a .then and we should get back the parsed data.
    AuthService.login(user).then((data) => {
      console.log(data);
      //Once the AuthService returns the data, we can desconstruct it.
      const { isAuthenticated, user, message } = data;
      if (isAuthenticated) {
        //If Authenticated we have to update the global context of the user. We have to set it to isAuthenticated: true
        //Assign user object returned by the AuthService.login to the current authContext state.
        authContext.setUser(user);
        authContext.setIsAuthenticated(isAuthenticated);

        //Now that they are logged in, lets redirect them.
        //The history object within props has a function called push which tells the browser where to go.
        props.history.push('/todos');
      } else {
        setMessage(message);
      }
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h3>Please sign in</h3>

        {/* Apparently, we need to use htmlFor instead of for because it is a used word. We are just setting up the form labels here. */}
        <label htmlFor='username' className='sr-only'>
          Username:
        </label>
        <input
          type='text'
          name='username'
          onChange={onChange}
          className='form-control'
          placeholder='Enter Username/Email'
        />
        <label htmlFor='password' className='sr-only'>
          Password:{' '}
        </label>
        <input
          type='password'
          name='password'
          onChange={onChange}
          className='form-control'
          placeholder='Enter Password'
        />

        <button className='btn btn-lg btn-primary btn-block' type='submit'>
          Log in
        </button>
      </form>

      {/* Here we will have our message in case we need to show it. */}
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default Login;
