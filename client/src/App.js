import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import { API } from "./config/api";

import { useContext, useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "./context/userContext";

import Home from './pages/Home'
import HomeLogin from './pages/HomeLogin';
import HomeAdmin from './pages/HomeAdmin';
import Detail from './pages/DetailFilm';
import DetailAfter from './pages/DetailFilmAfter';
import Profile from './pages/Profile';
import ListFilm from './pages/ListFilm';
import AddFilm from './pages/AddFilm';

function App() {
  let api = API();
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);  

  useEffect(() => {
    // Redirect Auth
    if (state.isLogin == false) {
      navigate("/landing");
    } else {
      if (state.user.status == "admin") {
        navigate("/admin");        
      } else if (state.user.status == "customer") {
        navigate("/");
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const config = {
        method: "get",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get("/check-auth", config);

      // If the token incorrect
      if (response.status === "failed") {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // // Get user data
      let payload = response.data.user;
      // // Get token from local storage
      payload.token = localStorage.token;

      // // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);      

  return (
    <Routes>
      <Route exact path="/" element={<HomeLogin/>} />      
      <Route exact path="/admin" element={<HomeAdmin/>} />      
      <Route exact path="/landing" element={<Home/>} />      
      <Route exact path="/detail/:id" element={<Detail/>} />      
      <Route exact path="/detail-after" element={<DetailAfter/>} />      
      <Route exact path="/profile" element={<Profile/>} />      
      <Route exact path="/list-film" element={<ListFilm/>} />      
      <Route exact path="/add" element={<AddFilm/>} />      
    </Routes>
  );
}

export default App;
