import React from "react";
import "./app.scss";
import Home from "./containers/home/Home";
import Profile from "./containers/profile/Profile";
import Course from './containers/course/Course';
import Layout from './containers/layout/Layout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/login&register/Register";
import Login from "./components/login&register/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
   palette: {
      primary: {
         light: '#406588',
         main: '#0a3b5b',
         dark: '#001531',
         contrastText: '#ffffff',
      },
      secondary: {
         light: '#6dbcf4',
         main: '#328cc1',
         dark: '#005f90',
         contrastText: '#000000',
      },
   },
   typography: {
      fontFamily: 'Source Sans Pro',
      fontWeightLight: 400,
      fontWeightMedium: 500,
      fontWeightRegular: 600,
      fontWeightBold: 700,
   }
});

const App = () => {

   return (
      <ThemeProvider theme={theme}>
         <BrowserRouter>
            <div className="container">
               <Routes>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route element={<Layout />}>
                     <Route path="/" element={<Home />} />
                     <Route path="/profile/:id" element={<Profile />} />
                     <Route path="/classes/:id" element={<Course />} />
                     <Route path="/groups" element={<Home />} />
                  </Route>
               </Routes>
            </div>
         </BrowserRouter>
         <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
         />
         <ToastContainer />
      </ThemeProvider>
   );
}

export default App;
