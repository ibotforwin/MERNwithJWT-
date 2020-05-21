//These are for convenience of user, it will be used somewhere else.
//This is for seperation of concerns.

//We already have our routes set up. These components we are building for use in other applications are simply utilizing those routes.
//We can then import and use them in other files for cleaner code.

export default {
  login: (user) => {
    return fetch('/user/login', {
      method: 'post',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res.status !== 401) {
        //This will return the responses we already built in routes in the case of a 401.
        return res.json().then((data) => data);
      } else {
        //If no 401, that means we are not authenticated.
        return {
          isAuthenticated: false,
          user: { username: '', email: '', role: '' },
        };
      }
    });
    //This is a promise so we need a .then and then another then to return parsed data.
    // .then((res) => res.json())
    // .then((data) => data)
  },

  register: (user) => {
    return (
      fetch('/user/register', {
        method: 'post',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        //This is a promise so we need a .then and then another then to return parsed data.
        .then((res) => res.json())
        .then((data) => data)
    );
  },
  logout: () => {
    //Again, first "then" parses the data into json, second "then" returns the json data as "data"
    return fetch('user/logout')
      .then((res) => res.json())
      .then((data) => data);
  },

  //isAuthenticated will be used to persistenly sync our authentication status between the front and back end.
  //So even if a user closes the browser, this will help maintain their token if they didn't logout.
  isAuthenticated: () => {
    return fetch('/user/authenticated').then((res) => {
      //We are checking if the route worked. Passport automatically returns 401 if we are not authenticated.
      if (res.status !== 401) {
        //This will return the responses we already built in routes in the case of a 401.
        return res.json().then((data) => data);
      } else {
        //If no 401, that means we are not authenticated.
        return {
          isAuthenticated: false,
          user: { username: '', email: '', role: '' },
        };
      }
    });
  },
};
