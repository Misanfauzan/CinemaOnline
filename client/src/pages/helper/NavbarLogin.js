import React, {useContext, useState, useEffect} from "react"

import "../../assets/css/all.css"
import "../../assets/css/navbar.css"

import 'bootstrap'
import { Image, Modal, Button, ListGroup, Item } from "react-bootstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faClapperboard, faLightbulb, faUser, faUserCircle, faUserMd } from '@fortawesome/free-solid-svg-icons'

import { useNavigate, useParams, Link } from "react-router-dom"

import { useQuery, useMutation } from "react-query";
import { UserContext } from "../../context/userContext";
import ReactDOM from 'react-dom';

import LoginModal from "../modal/LoginModal"
import RegisterModal from "../modal/RegisterModal"

function Navbar() {      
  
    // useNavigate declare
    const navigate = useNavigate()       

    const [show, setShow] = useState(false);    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [state, dispatch] = useContext(UserContext);
    const logout = () => {
        console.log(state);
        dispatch({
          type: "LOGOUT",
        });
        navigate("/landing");
    };


    return (        
        <>        
        <nav className="navbar navbar-expand-lg navbar-dark mt-4">           
            <Link className="navbar-brand" to="/">
                <img src={require('../../assets/image/Icon.png')} className="d-block w-100" />                        
            </Link>            
            <div className="collapse navbar-collapse d-flex" style={{justifyContent: 'flex-end'}}> 
                <img onClick={handleShow} src={state.user.image} style={{ objectFit: 'cover', height: '3rem', width:'3rem', cursor: 'pointer', borderRadius: '100%', border:'3px solid #CD2E71' }} />                                          
            </div>            
        </nav>        
            <Modal show={show} onHide={handleClose}  dialogClassName="modal-notif" >          
                <div style={{ position: 'fixed',right: '10%',top: '15%' }}>
                    <div style={{width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderBottom: '20px solid #212529'}} />
                </div>          
            <Modal.Body className="bg-dark" style={{ width: '15rem', padding: 0 }}>
                <Link to="/profile" className="row mx-2 my-3 d-flex" style={{ textDecoration: 'none', color: 'white', alignItems: 'center' }}>
                    <div className="col-3 d-flex" style={{ alignItems: 'center'}}>
                        <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', color: '#CD2E71' }}/>
                    </div>
                    <div className="col d-flex" style={{ alignItems: 'center'}}>
                        <b>Profile</b>
                    </div>
                </Link> 
                <Link to="/list-film" className="row mx-2 my-3 d-flex" style={{ textDecoration: 'none', color: 'white', alignItems: 'center' }}>
                    <div className="col-3 d-flex" style={{ alignItems: 'center'}}>                        
                        <FontAwesomeIcon icon={faClapperboard} style={{ fontSize: '20px', color: '#CD2E71' }}/>
                    </div>
                    <div className="col d-flex" style={{ alignItems: 'center'}}>
                        <b>My List Film</b>
                    </div>
                </Link>
                <hr/>
                <Link to="" className="row mx-2 my-3 d-flex" style={{ textDecoration: 'none', color: 'white', alignItems: 'center' }}>
                    <div className="col-3 d-flex" style={{ alignItems: 'center'}}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ fontSize: '20px', color: 'red' }}/>
                    </div>
                    <div className="col d-flex" style={{ alignItems: 'center'}} onClick={logout}>
                        <b>Logout</b>
                    </div>
                </Link>               
            </Modal.Body>     
            </Modal> 
        </>
    )
}
  
export default Navbar;