import React, { useEffect, useState } from 'react';
import './App.css';
import SideBar from './Sidebar';
import Login from './Login';
import Chat from './Chat';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { useStateValue } from './StateProvider';
import { actionTypes } from './reducer';
import {GetLocalStorageData, LocalStorageConst} from './Utils/LocalStorageUtils'
function App() {
  const [{user}, dispatch] = useStateValue();
  
  useEffect(() => {
    const loggedInUser = GetLocalStorageData(LocalStorageConst.user);
    if (loggedInUser) {
      dispatch({
        type : actionTypes.SET_USER,
        user : loggedInUser,
      })
    }
  }, []);

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
