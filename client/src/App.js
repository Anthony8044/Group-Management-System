import React, { useContext } from "react";
//import "./app.scss";
import Home from "./containers/home/Home";
import Profile from "./containers/profile/Profile";
import Course from './containers/course/Course';
import Section from "./containers/course/Section";
import Layout from './containers/layout/Layout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/login&register/Register";
import Login from "./components/login&register/Login";
import { UserContextProvider } from "./containers/UserContext";
import { LocalizationProvider } from '@mui/lab';
import MomentAdapter from '@mui/lab/AdapterMoment';
import { CssBaseline, ScopedCssBaseline } from "@mui/material";
import { SnackbarProvider } from 'notistack';


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

const App = ({ children }) => {

   return (
      <ThemeProvider theme={theme}>
         <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ horizontal: "right", vertical: "top" }}>
            <LocalizationProvider dateAdapter={MomentAdapter}>{children}</LocalizationProvider>
            <BrowserRouter>
               <Routes>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route element={<UserContextProvider><Layout /> </UserContextProvider>}>
                     <Route path="/" element={<Home />} />
                     <Route path="/profile/student/:sid" element={<Profile />} />
                     <Route path="/profile/teacher/:tid" element={<Profile />} />
                     <Route path="/course/:courseid" element={<Course />} />
                     <Route path="/course/:courseid/:sectionid" element={<Section />} />
                     <Route path="/groups" element={<Home />} />
                  </Route>
               </Routes>
            </BrowserRouter>
         </SnackbarProvider>
      </ThemeProvider >
   );
}

export default App;
