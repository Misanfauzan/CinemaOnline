import React, {Component, useState, useEffect} from "react"

import "../assets/css/all.css"

import 'bootstrap'
import { Carousel, Modal } from "react-bootstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  } from '@fortawesome/free-solid-svg-icons'

import { useNavigate, useParams, Link } from "react-router-dom"

import { useQuery, useMutation } from "react-query";
import { UserContext } from "../context/userContext";
import ReactDOM from 'react-dom';

import LoginModal from "./modal/LoginModal"
import RegisterModal from "./modal/RegisterModal"

import { API } from "../config/api";
import toRupiah from '@develoka/angka-rupiah-js';

function Home() {  
    const title = "Home";
    document.title = "CinemaOnline | " + title;
    
    let api = API();        
      
    // useNavigate declare
    const navigate = useNavigate()

    // Modal Login
    const [show, setShow] = useState(false);    
    const handleClose1 = () => setShow(false);
    const handleShow1 = () => {
        handleClose2(false)
        setShow(true)
    };  
 
    // //
 
    // Modal Register
    const [show2, setShow2] = useState(false);    
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => {
        handleClose1(false)
        setShow2(true)
    };
        
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
                <nav className="navbar navbar-expand-lg navbar-dark mt-4">           
                    <Link className="navbar-brand" to="/landing">
                        <img src={require('../assets/image/Icon.png')} className="d-block w-100" alt="..." />                        
                    </Link>            
                    <div className="collapse navbar-collapse d-flex" style={{justifyContent: 'flex-end'}}>                 
                        <span className="me-5" onClick={handleShow1} style={{ cursor: 'pointer' }} >Login</span>
                        <span onClick={handleShow2} className="px-4 py-2" style={{ cursor: 'pointer', backgroundColor: '#CD2E71', borderRadius: '5px' }} >Register</span>
                    </div>            
                </nav>           
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
                                        <span onClick={handleShow1} className="px-4 py-2" style={{ cursor: 'pointer', backgroundColor: '#CD2E71', borderRadius: '5px', fontWeight: 'bolder', position: 'absolute', marginTop: '18rem' }} >Buy Now</span>                                        
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
                    <div className="col-2 mb-4">
                        <div className="card mx-auto" style={{padding: 0, width: '9rem', cursor: 'pointer'}}>
                            <img onClick={handleShow1} src={item1.image} style={{height: '13rem', objectFit: 'cover' }}/>                           
                        </div> 
                    </div>  
                ))}                                                                                                                                                                   
                </div>                                                         
            </div>
            <Modal show={show} onHide={handleClose1} aria-labelledby="contained-modal-title-vcenter" centered>                 
                <Modal.Body className="bg-dark">
                    <div className="container">
                        <div className="row mt-3">
                            <h1 style={{ color: '#CD2E71' }}><b>Login</b></h1>
                        </div>
                        <div className="row mt-1 mb-2">
                            <LoginModal/>
                            <p className="text-center text-muted">
                                Don't Have an account? Click 
                                <span style={{cursor: 'pointer', fontSize: '17px', color: 'gray'}} onClick={handleShow2}>
                                <b> Here</b>
                                </span>                  
                            </p>
                        </div>
                    </div> 
                </Modal.Body>                  
            </Modal>

            <Modal show={show2} onHide={handleClose2} aria-labelledby="contained-modal-title-vcenter" centered>                 
                <Modal.Body className="bg-dark">
                    <div className="container">
                        <div className="row mt-3">
                            <h1 style={{ color: '#CD2E71' }}><b>Register</b></h1>
                        </div>
                        <div className="row mt-1 mb-2">
                            <RegisterModal/>
                            <p className="text-center text-muted">
                                Don't Have an account? Click 
                                <span style={{cursor: 'pointer', fontSize: '17px', color: 'gray'}} onClick={handleShow1}>
                                <b> Here</b>
                                </span>                  
                            </p>
                        </div>
                    </div> 
                </Modal.Body>                  
            </Modal>
        </>
    )
}
  
export default Home;