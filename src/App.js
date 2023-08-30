import './App.css';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import LoginRegisterPage from './pages/loginRegister';
import HomePage from './pages/home';
import ProfilePage from './pages/profile';
import Messenger from './pages/messenger';
import EditProfile from './pages/edit-profile';
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { materialUITheme} from "../src/data/constants";
import React from 'react';


function App() {

  const theme = useMemo(() => createTheme(materialUITheme), []);
  const isUserLoggedIn = (useSelector((state) => state.userInfo)) !== null;

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
        <CssBaseline />
          <Routes>
            <Route path = "/" element = {<LoginRegisterPage/>} /> 
            <Route path="/home"  element={isUserLoggedIn ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/messenger"  element={isUserLoggedIn ? <Messenger /> : <Navigate to="/" />} />
            <Route path="/edit-profile"  element={isUserLoggedIn ? <EditProfile /> : <Navigate to="/" />} />
            <Route path="/profile/:id" element={isUserLoggedIn ? <ProfilePage /> : <Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
