import React from "react";
import "./app.scss";
import Home from "./containers/home/Home";
import Profile from "./containers/profile/Profile";
import Course from './containers/course/Course';
import Layout from './containers/layout/Layout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterStudent from "./components/login&register/RegisterStudent";

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
                  <Route path="/" element={<Layout><Home /> </Layout>} />
                  <Route path="/profile/:id" element={<Layout><Profile /> </Layout>} />
                  <Route path="/classes/:id" element={<Layout><Course /> </Layout>} />
                  <Route path="/groups" element={<Layout><Home /> </Layout>} />
                  <Route path="/register" element={<RegisterStudent />} />
               </Routes>
            </div>
         </BrowserRouter>
      </ThemeProvider>
   );
}

export default App;
