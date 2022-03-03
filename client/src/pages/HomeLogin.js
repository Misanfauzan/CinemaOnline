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

import NavbarLogin from './helper/NavbarLogin'
import { API } from "../config/api";
import toRupiah from '@develoka/angka-rupiah-js';

function Home() {  
    const title = "Home";
    document.title = "CinemaOnline | " + title;
  
    let api = API();        
        
    let { data: film } = useQuery("filmCache", async () => {
        const config = {
            method: "GET",        
        };
        const response = await api.get("/film", config);
        return response.data;
    });

    
    let { data: films } = useQuery("filmsCache", async () => {
        const config = {
            method: "GET",        
        };
        const response = await api.get("/films", config);
        return response.data;
    });

    return (        
        <>
            <div className="container">
                <NavbarLogin/>                                            
                <div className="container-fluid">
                    <Carousel className="mx-5 my-4">                        
                        {film?.map((item) => (
                        <Carousel.Item style={{ backgroundColor: '#2C3333' }}>
                            <img src={item.image} style={{ height: '30rem', opacity: 0.3, objectFit: 'cover', width: '100%' }}/>
                            <Carousel.Caption style={{ top: 0 }}>                            
                                <div className="d-flex">
                                    <div class="d-flex flex-column mt-5" style={{ alignItems: 'baseline' }}>
                                        <div className="row">
                                            <span className="text-uppercase" style={{ fontWeight: 'bolder', letterSpacing: '1px', fontSize: 'xxx-large' }}>{item.title}</span>
                                        </div>                                        
                                        <div className="row mt-5">
                                            <span style={{ fontWeight: 'bolder' }}>{item.categories.category}</span>
                                        </div>
                                        <div className="row mt-3">
                                            <span style={{ fontWeight: 'bolder', color: '#CD2E71' }}>{toRupiah(item.price, {dot: ',', formal: false, floatingPoint: 0})}</span>
                                        </div>
                                        <div className="row mt-3">
                                            <span className="text-sm-start" >
                                            {item.desc}
                                            </span>
                                        </div>
                                        <Link to={`/detail/${item.id}`} className="px-4 py-2" style={{ cursor: 'pointer', backgroundColor: '#CD2E71', borderRadius: '5px', fontWeight: 'bolder', position: 'absolute', marginTop: '18rem', color:'white', textDecoration:'none' }} >Buy Now</Link>                                        
                                    </div>                                    
                                </div>                                                                     
                            </Carousel.Caption>
                        </Carousel.Item>  
                        ))}                                                  
                    </Carousel>
                </div>
                <div className="row my-4">
                    <span style={{ fontWeight: 'bolder', fontSize: 'xx-large' }}>List Film</span>                
                </div>
                <div className="row mx-4 my-4">       
                    {films?.map((item1) => (             
                    <Link to={`/detail/${item1.id}`} className="col-2 mb-4">
                        <div className="card mx-auto" style={{padding: 0, width: '9rem'}}>
                            <img src={item1.image} style={{height: '13rem', objectFit: 'cover' }}/>                           
                        </div> 
                    </Link>  
                    ))}                                                                                                                                                                                    
                </div>                                                         
            </div>
        </>
    )
}
  
export default Home;