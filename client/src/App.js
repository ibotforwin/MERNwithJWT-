//We are importing "useContext" to use our hooks.
import React from 'react';
//Here are are importing the actual context from which we will pull variables using "useContext" which was pulled above. The import is only needed for the "TEST PORTION" to work.
// import { AuthContext } from './Context/AuthContext';

//We are importing the Navbar and Home component we created.
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Todos from './Components/Todos';
import Admin from './Components/Admin';

//Importing our private route
import PrivateRoute from './hocs/PrivateRoute';
import UnPrivateRoute from './hocs/UnPrivateRoute';

//This is a routing system.
//The Router is the main router and the Route component takes a path and renders whatever is in that component.
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    //The "Route" components are within the Router.
    <Router>
      <Navbar />
      <Route exact path='/' component={Home} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/register' component={Register} />
      {/* Defined are the roles that can access the private route */}
      <PrivateRoute path='/todos' roles={['user', 'admin']} component={Todos} />
      <PrivateRoute path='/admin' roles={['admin']} component={Admin} />
      <UnPrivateRoute path='/login' component={Login} />
      <UnPrivateRoute path='/register' component={Register} />
    </Router>
  );
}

export default App;
