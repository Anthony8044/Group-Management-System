import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';
import authReducer from './features/Auth';
import studentsReducer from './features/Student';
import teachersReducer from './features/Teacher';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'
import reducers from './reducers';
import { composeWithDevTools } from "redux-devtools-extension";

//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
//export const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))
const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
