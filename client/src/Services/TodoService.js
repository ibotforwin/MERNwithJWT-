//The TodoService will make calls to our backend.
//Fetch Todos and create Todos

export default {
  getTodos: () => {
    return (
      fetch('/user/todos')
        //Once we fetch and get a response, we need to check the response.
        .then((response) => {
          //This is because passport automatically returns 401 if not authenticated
          if (response.status !== 401) {
            //Then we should get the data. We can then return that data.
            return response.json().then((data) => data);
          } else {
            return {
              message: { msgBody: 'UnAuthorized' },
              msgError: true,
            };
          }
        })
    );
  },
  //This function takes an argument of todo, which is the todo we want to create.
  postTodo: (todo) => {
    return fetch('user/todo', {
      method: 'post',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.status !== 401) {
        //Then we should get the data. We can then return that data.
        return response.json().then((data) => data);
      } else {
        return {
          message: { msgBody: 'UnAuthorized' },
          msgError: true,
        };
      }
    });
  },
};
