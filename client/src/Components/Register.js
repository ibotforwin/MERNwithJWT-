//Importing three hooks.
//useRef will be used to create an instance variable because we are using the setTimeout method
//useEffect will be used to clean up what the setTimeout function does
//(useContext not required since we are registering and don't have global variables yet)
import React, { useState, useRef, useEffect } from 'react';

//Authentication
import AuthService from '../Services/AuthService';

//Helper component that displays the message from server
import Message from '../Components/Message';

const Register = (props) => {
  //First let's set out states with their default states
  const [user, setUser] = useState({
    email: '',
    username: '',
    password: '',
    role: '',
  });
  const [message, setMessage] = useState(null);

  //Creating timer ID
  let timerID = useRef(null);

  //I believe this "useEffect" runs on load. It clears the timer, I'm guessing this is related to session time.
  //It takes a callback
  //Equivalent to component did unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerID);
    };
    //Only run once.
  }, []);

  const onChange = (e) => {
    // The ...user copies the existing properties of user. The e.target.name : e.target.value updates the object to the data that is being input by the user.
    //I believe this allows dynamic updating of the object before it is submitted.
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    //This is from our useState
    setUser({ email: '', username: '', password: '', role: '' });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    //We will be using the AuthService here
    //The AuthService returns a promise, so we will do a .then and we should get back the parsed data.
    AuthService.register(user).then((data) => {
      //Once the AuthService returns the data, we can desconstruct it.
      const { message } = data;
      console.log(data);
      console.log(message);
      console.log('--------------');
      setMessage(message);
      resetForm();

      //We are going to show them the message, such as successfully registered for 2000 ms and then take them to the login page.
      if (message) {
        timerID = setTimeout(() => {
          props.history.push('/login');
        }, 2000);
      }
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h3>Please register</h3>

        {/* Apparently, we need to use htmlFor instead of for because it is a used word. We are just setting up the form labels here. */}

        <label htmlFor='email' className='sr-only'>
          Username:
        </label>
        <input
          type='text'
          name='email'
          // This (below) is required for clear form.
          value={user.email}
          onChange={onChange}
          className='form-control'
          placeholder='Enter Email'
        />
        <label htmlFor='username' className='sr-only'>
          Username:
        </label>
        <input
          type='text'
          name='username'
          value={user.username}
          onChange={onChange}
          className='form-control'
          placeholder='Enter Username'
        />
        <label htmlFor='password' className='sr-only'>
          Password:
        </label>
        <input
          type='password'
          name='password'
          value={user.password}
          onChange={onChange}
          className='form-control'
          placeholder='Enter Password'
        />
        <label htmlFor='role' className='sr-only'>
          Role:
        </label>
        <input
          type='text'
          name='role'
          value={user.role}
          onChange={onChange}
          className='form-control'
          placeholder='Enter Role'
        />

        <button className='btn btn-lg btn-primary btn-block' type='submit'>
          Register
        </button>
      </form>

      {/* Here we will have our message in case we need to show it. */}
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default Register;
