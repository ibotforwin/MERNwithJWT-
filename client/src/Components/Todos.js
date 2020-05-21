import React, { useState, useContext, useEffect } from 'react';
import TodoItem from '../Components/TodoItem';
import TodoService from '../Services/TodoService';
import { AuthContext } from '../Context/AuthContext';
import Message from '../Components/Message';

//This is a functional components
const Todos = (props) => {
  //This is our todo state. Initial state is empty for the todo task.
  const [todo, setTodo] = useState({ name: '' });
  console.log('Loading a Todo in the beginning of the Todos const');
  console.log(todo);
  //This is a bunch todos. This is going to get our todos from the database in the form of an array.
  const [todos, setTodos] = useState([]);
  console.log('Multiple222222222222222222222');
  console.log(todos);
  const [message, setMessage] = useState(null);

  //I believe this is for authentication/checking if the user is still authenticated before viewing todos.
  const authContext = useContext(AuthContext);

  //We will use the useEffect hook to do a comonentDidmount equivalent
  useEffect(() => {
    TodoService.getTodos().then((data) => {
      console.log('333333333333333333333');
      console.log(data);
      setTodos(data.todos);
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    TodoService.postTodo(todo).then((data) => {
      const { message } = data;
      console.log('MESSAGE');
      console.log(message);

      resetForm();
      if (!message.msgError) {
        TodoService.getTodos().then((getData) => {
          setTodos(getData.todos);
          setMessage(message);
        });
      } else if (message.msgBody === 'UnAuthorized') {
        setMessage(message);
        authContext.setUser({ username: '', role: '' });
        authContext.setIsAuthenticated(false);
      } else {
        setMessage(message);
      }
    });
  };

  const onChange = (e) => {
    setTodo({ name: e.target.value });
  };

  const resetForm = () => {
    setTodo({ name: '' });
  };

  return (
    <div>
      <ul className='list-group'>
        {/* JSX here */}

        {todos.map((todo) => {
          console.log(todo);
          //We are giving the TodoItem a unique key
          //We are passing the actual todo as a prop

          return <TodoItem key={todo._id} todo={todo} />;
        })}
      </ul>
      <br />
      <form onSubmit={onSubmit}>
        {/* This will be used to accept a creation of another todo */}
        <label htmlFor='todo'>Enter Todo</label>
        <input
          type='text'
          name='todo'
          value={todo.name}
          onChange={onChange}
          className='form-control'
          placeholder='Please enter todo'
        />
        <button className='btn btn-lg btn-primary btn-block' type='submit'>
          Submit
        </button>
      </form>
      {message ? <Message message={message} /> : null}
    </div>
  );
};
export default Todos;
