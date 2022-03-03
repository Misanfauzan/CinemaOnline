import React, {Component, useState, useEffect} from "react"

import "../assets/css/all.css"

import 'bootstrap'
import { Carousel } from "react-bootstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faCompass, faHeart, faHome, faPaperPlane, faPlusSquare, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { useNavigate, useParams, Link } from "react-router-dom"

import { useQuery, useMutation } from "react-query";
import { UserContext } from "../context/userContext";
import ReactDOM from 'react-dom';

import Embed from 'react-embed';
import { API } from "../config/api";


function DetailFilm() {  
    const title = "Film";
    document.title = "CinemaOnline | " + title;

    let id = useParams().id
    let api = API();        
        
    let { data: detail } = useQuery("detailCache", async () => {
        const config = {
            method: "GET",     
            headers: {
                Authorization: "Basic " + localStorage.token,
            }   
        };
        const response = await api.get("/film/" + id, config);
        return response.data
    });

    return (        
        <>
            <div className="container">
                {detail?.map((item) => (
                <div className="row my-4">
                    <div className="col-4 d-flex" style={{ justifyContent: 'center' }}>
                        <img src={item.image} style={{height: '20rem', width:'13rem',objectFit: 'cover' }}/>                           
                    </div>
                    <div className="col">
                        <div className="row">
                            <div className="col-6">
                                <span style={{ fontWeight: 'bolder', letterSpacing: '1px', fontSize: 'xx-large' }}>{item.title}</span>
                            </div>                                                        
                        </div>
                        <div className="row my-4">                            
                            <Embed url={item.link}/>                                                        
                        </div>                        
                        <div className="d-flex flex-row my-3">                            
                            {item.categories?.map((item) => (
                                <span className="text-muted pe-2" style={{ fontWeight: 'bolder'}}>{item.category}</span>                                        
                            ))}
                        </div>                         
                        <div className="row my-3">                            
                            <span className="text-sm-start" >
                                {item.desc}
                            </span>
                        </div>
                    </div>
                </div>
                ))}                                                                              
            </div>
        </>
    )
}
  
export default DetailFilm;