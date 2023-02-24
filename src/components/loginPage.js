/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useStore } from 'react-redux';
import { signInUser } from '../actions/actions';
import { SERVER_ADDRESS, USER_LOGIN_URL, USER_SIGNUP_URL } from '../constants';
import './Login.css';

export default function Login(props) {
  const store = useStore();

  const handleTestButton = () => {
    let storeState = store.getState();
    console.log(storeState);
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    console.log(userToken);
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();

    const signInFunc = (username, password, type) => {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,
          usertype: type
        })
      };
      const postFunc = async () => {
        try {
          await fetch(SERVER_ADDRESS + USER_LOGIN_URL, requestOptions).then((response) => {
            // console.log(response.status);
            if (response.status === 200) {
              console.log(
                'in sign in func response 200, user information: ',
                username,
                ':',
                password,
                ':',
                type
              );
              store.dispatch(signInUser(username, type));
              props.setToken({ username: username, type: type });
              alert('User: ' + username + ', Type: ' + type + ' signed in successfully!');
              window.location.reload(false);
            } else {
              response.json().then((data) => {
                console.log(data);
                alert(data);
              });
            }
          });
        } catch (error) {
          console.error(error);
        }
      };

      postFunc();
    };

    signInFunc(e.target.username.value, e.target.password.value, e.target.user_type.value);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();

    const signUpFunc = (username, password, type) => {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,
          usertype: type
        })
      };
      const postFunc = async () => {
        try {
          await fetch(SERVER_ADDRESS + USER_SIGNUP_URL, requestOptions).then((response) => {
            // console.log(response.status);
            if (response.status === 200) {
              console.log(
                'in sign up func response 200, user information: ',
                username,
                ':',
                password,
                ':',
                type
              );
              store.dispatch(signInUser(username, type));
              props.setToken({ username: username, type: type });
              alert('User: ' + username + ', Type: ' + type + ' created successfully!');
              window.location.reload(false);
            } else {
              response.json().then((data) => {
                console.log(data);
              });
            }
          });
        } catch (error) {
          console.error(error);
        }
      };

      postFunc();
    };

    signUpFunc(e.target.username.value, e.target.password.value, e.target.user_type.value);
  };

  return (
    <div className="user-page-container">
      <div className="login-wrapper">
        <h1>Sign in</h1>
        <form onSubmit={handleSignInSubmit}>
          <label>
            <p>Username</p>
            <input type="text" name="username" />
          </label>
          <label>
            <p>Password</p>
            <input type="password" name="password" />
          </label>
          <label>
            <p>
              Dealer
              <input type="radio" defaultChecked={true} value={'dealer'} name="user_type" />
            </p>
            <p>
              Guest
              <input type="radio" value={'guest'} name="user_type" />
            </p>
          </label>
          <div className="login-page-button-div">
            <button type="submit">Sign in</button>
          </div>
        </form>
      </div>
      <div className="signup-wrapper">
        <h1>Sign up</h1>
        <form onSubmit={handleSignUpSubmit}>
          <label>
            <p>Username</p>
            <input type="text" name="username" />
          </label>
          <label>
            <p>Password</p>
            <input type="password" name="password" />
          </label>
          <label>
            <p>
              Dealer
              <input type="radio" defaultChecked={true} value={'dealer'} name="user_type" />
            </p>
            <p>
              Guest
              <input type="radio" value={'guest'} name="user_type" />
            </p>
          </label>
          <div className="login-page-button-div">
            <button type="submit">Sign up</button>
          </div>
        </form>
      </div>

      <button onClick={handleTestButton}>log store state</button>
    </div>
  );
}

export function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token
  };
}
