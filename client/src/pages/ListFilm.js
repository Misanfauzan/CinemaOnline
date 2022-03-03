import React, {Component, useState, useEffect} from "react"

import "../assets/css/all.css"

import 'bootstrap'
import { Modal } from "react-bootstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faCompass, faHeart, faHome, faPaperPlane, faPlay, faPlusSquare, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { useNavigate, useParams, Link } from "react-router-dom"

import { useQuery, useMutation } from "react-query";
import { UserContext } from "../context/userContext";
import ReactDOM from 'react-dom';

import NavbarLogin from './helper/NavbarLogin'
import { API } from "../config/api";

function ListFilm() {  
    const title = "My Film";
    document.title = "CinemaOnline | " + title;
  
    let api = API();            
         
    let { data: list } = useQuery("listCache", async () => {
        const config = {
            method: "GET",     
            headers: {
                Authorization: "Basic " + localStorage.token,
            }   
        };
        const response = await api.get("/transaction-user", config);
        return response.data
    });
        
    return (        
        <>
            <div className="container">
                <NavbarLogin/>                                            
                <div className="mt-4">
                    <span style={{ fontWeight: 'bolder', fontSize: 'xx-large' }}>
                        List Film
                    </span>                                                                             
                </div>
                <div className="row mx-4 my-4">     
                    {list?.map((item) => (
                    <Link to={`/detail/${item.films.id}`} className="col-2 mb-4">
                        <div className="card mx-auto" style={{padding: 0, width: '9rem'}}>
                            <img src={item.imageFilm} style={{height: '13rem', objectFit: 'cover' }}/>                           
                        </div> 
                    </Link>   
                    ))}                                     
                </div>
            </div>            
        </>
    )
}
  
export default ListFilm;