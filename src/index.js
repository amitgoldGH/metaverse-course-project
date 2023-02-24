import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = createStore(rootReducer, applyMiddleware(thunk));
root.render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);
