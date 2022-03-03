import React, {Component, useState, useEffect} from "react"

import "../assets/css/all.css"

import 'bootstrap'
import { Table, Modal } from "react-bootstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faComment, faCompass, faHeart, faHome, faPaperPlane, faPlusSquare, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { useNavigate, useParams, Link } from "react-router-dom"

import { useQuery, useMutation } from "react-query";
import { UserContext } from "../context/userContext";
import ReactDOM from 'react-dom';

import NavbarAdmin from './helper/NavbarAdmin'
import { API } from "../config/api";

function Home() {  
    const title = "Admin";
    document.title = "CinemaOnline | " + title;
  
    let api = API();        

    let { data: transaction, refetch } = useQuery("transactionCache", async () => {
        const config = {
          method: "GET",
          headers: {
            Authorization: "Basic " + localStorage.token,
          },
        };
        const response = await api.get("/transaction", config);
        return response.data;
    }); 

    // Approved
    const [value, setValue] = useState();        
    let handleValue = (item) => setValue({
        id: item.id         
    }); 

    useEffect( async () => {
        const body = JSON.stringify(value);       
    
        const config = {
          method: "PATCH", 
          headers: {
            "Content-type": "application/json",
          },       
          body: body,
        };
          
        await api.patch("/transaction-approved", config);
        refetch();
    },[value]);

    // Cancel
    const [value1, setValue1] = useState();        
    let handleValue1 = (item) => setValue1({
        id: item.id         
    }); 

    useEffect( async () => {
        const body = JSON.stringify(value1);       
    
        const config = {
          method: "PATCH", 
          headers: {
            "Content-type": "application/json",
          },       
          body: body,
        };
          
        await api.patch("/transaction-cancel", config);
        refetch();
    },[value1]);

    const [show, setShow]   = useState(false);    
    const handleClose       = () => setShow(false);
    const handleShow        = (item) => setShow({
        ...item, 
    }); 

    return (        
        <>
            <div className="container">
                <NavbarAdmin/>                                            
                <div className="container-fluid">                                        
                    <div className="row mx-2 my-4" style={{ fontWeight: 'bolder', fontSize: 'xx-large' }}>List Transaction</div>                
                    <div className="row mx-2 my-4">
                        <Table className="table table-dark" striped hover variant="dark">
                            <thead className="text-danger">
                                <tr className="text-center">
                                    <th>No</th>
                                    <th>Users</th>
                                    <th>Bukti Transfer</th>
                                    <th>Film</th>
                                    <th>Number Account</th>
                                    <th>Status Payment</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {transaction?.map((item, index) => (
                                <tr className="align-middle" style={{ borderTop: '2px solid currentColor' }}>
                                    <td>{index+1}</td>
                                    <td className="text-start">{item.users.name}</td>
                                    <td> 
                                        <img onClick={() => handleShow(item)} src={item.image} style={{ cursor:'pointer' ,height: '5rem', width:'5rem', objectFit:'cover' }}/>                                                             
                                    </td>
                                    <td>{item.films.title}</td>
                                    <td>{item.number_pay}</td>
                                    <td>                                        
                                        {(() => {
                                            if (item.status_pay == 'Approved') {
                                                return(
                                                    <>
                                                        <span className="text-success">
                                                            {item.status_pay}
                                                        </span>
                                                    </>
                                                )
                                            } else if(item.status_pay == 'Pending') {
                                                return(
                                                    <>
                                                        <span className="text-warning">
                                                            {item.status_pay}
                                                        </span>
                                                    </> 
                                                )
                                            } else if(item.status_pay == 'Cancel'){
                                                return(
                                                    <>
                                                        <span className="text-danger">
                                                            {item.status_pay}
                                                        </span>
                                                    </> 
                                                )
                                            }
                                        })()}
                                    </td>
                                    <td>                                                                                
                                        <form >
                                            <div data-bs-toggle="dropdown" aria-expanded="false">
                                                <FontAwesomeIcon icon={faCaretDown} style={{ color: '#1C9CD2', fontSize: '20px', cursor:'pointer' }} />
                                            </div>                                                                                        
                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark mt-3 me-3">
                                                <li>
                                                    <div style={{ position: 'absolute',right: '8.5%',top: '-18%' }}>
                                                        <div style={{width: 0, height: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent', borderBottom: '15px solid #343A40'}} />
                                                    </div>
                                                </li>
                                                <li>
                                                    <button onClick={() => handleValue(item)} className="dropdown-item" type="button">Approved</button>
                                                </li>
                                                <li>
                                                    <button onClick={() => handleValue1(item)} className="dropdown-item" type="button">Cancel</button>
                                                </li>
                                            </ul>                                        
                                        </form>
                                    </td>
                                </tr> 
                                ))}                                                                                                                                                                                                
                            </tbody>
                        </Table>
                    </div>
                </div>                                                                       
            </div>
            <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>                 
                <Modal.Body className="bg-dark p-0">
                    <div style={{ position:'relative' }}>
                        <img className="img-fluid" src={show.image} alt="" style={{width:'100%',height: '30rem', alignItems:'center', borderRadius: '15px', objectFit: 'cover'}} />
                        <button type="button" className="btn-close btn-close-white" onClick={handleClose} style={{ position: 'absolute',right: '1rem',top: '1rem' }} />
                    </div>
                </Modal.Body>                  
            </Modal>
        </>
    )
}
  
export default Home;