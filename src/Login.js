import React from 'react'
import "./Login.css"
import { Button } from '@material-ui/core';
import whatsAppLogo from './social-whatsapp.png';
import {auth, provider} from "./firebase" 
import { useStateValue } from './StateProvider';
import { actionTypes } from './reducer';
function Login() {
  const [{},dispatch] = useStateValue();
  const signIn = () =>{
    auth.signInWithPopup(provider)
    .then( result => {
      dispatch({
        type : actionTypes.SET_USER,
        user : result.user,
      })
    })
    .catch((error)=>console.log("Sign In Error: ", error))
  }
  return (
    <div className = "login">
      <div className="login_container">
        <img src={whatsAppLogo}/>
        <div className="login__text">
          <h1>Sign in to ADDA</h1>   
        </div>
        <Button type="submit" onClick={signIn}>
          Sing in With Google
        </Button>
      </div>
    </div>
  )
}

export default Login
