/* eslint-disable no-unused-vars */
import React from 'react';
import './func_components/gamelot.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ContainerLot } from './func_components/ContainerLot';

import Login, { useToken } from './components/loginPage';
import { useStore } from 'react-redux';
import { signInUser } from './actions/actions';
import { USER_TYPE_DEALER } from './constants';
import Navbar from './func_components/Navbar';
import background from './assets/background.jpg';

function App() {
  const { token, setToken } = useToken();
  const store = useStore();
  if (!token) {
    return (
      <div style={{ backgroundImage: `url(${background})` }}>
        <Login setToken={setToken} />
      </div>
    );
  } else {
    store.dispatch(signInUser(token.username.toLowerCase(), token.type));
  }

  return (
    <div className="wrapper" style={{ backgroundImage: `url(${background})` }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Navbar token={token} />
                <ContainerLot />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
