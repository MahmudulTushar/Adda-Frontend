import React, { useEffect, useState } from 'react';
import './App.css';
import SideBar from './Sidebar';
import Login from './Login';
import Chat from './Chat';
import Pusher from 'pusher-js'
import axios from './axios.js'
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { useStateValue } from './StateProvider';
function App() {
  const [{user}, dispatch] = useStateValue();
  return (
    <div className="app">
      { !user ? 
      (<Login/>)
      :(
      <div className="app__body">
        <Router>
          <SideBar/> 
          <Switch>  
            <Route path="/rooms/:roomId">
              <Chat />
            </Route>  
            <Route path="/">
              <Chat />
            </Route>
          </Switch>
        </Router>
     </div>
      )}
    </div>
  );
}

export default App;
