import React, {useContext, useState, useEffect} from "react"

import "../assets/css/all.css"

import 'bootstrap'
import { Modal, Alert } from "react-bootstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faCompass, faHeart, faHome, faPaperPlane, faPlay, faPlusSquare, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { useNavigate, useParams, Link } from "react-router-dom"

import { useQuery, useMutation } from "react-query";
import { UserContext } from "../context/userContext";
import ReactDOM from 'react-dom';

import NavbarLogin from './helper/NavbarLogin'
import DetailAfter from './DetailFilmAfter'

import { API } from "../config/api";
import toRupiah from '@develoka/angka-rupiah-js';

function DetailFilm() {  
    const title = "Film";
    document.title = "CinemaOnline | " + title;
  
    let id = useParams().id
    let api = API();        
    
    // useNavigate declare
    const navigate = useNavigate()
    
    const [show, setShow]   = useState(false);    
    const handleClose       = () => setShow(false);
    const handleShow        = (item) => setShow({
        ...item, 
        show: true
    }); 

    let showIdFilm = show.id

    const [show2, setShow2] = useState(false);    
    const handleClose2      = () => setShow2(false);
    const handleShow2       = () => setShow2(true)

    const [show3, setShow3] = useState(false);    
    const handleClose3      = () => setShow3(false);
    const handleShow3       = () => setShow3(true)
    

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
    
    let { data: transaction, refetch } = useQuery("transactionCache", async () => {
        const config = {
            method: "GET",     
            headers: {
                Authorization: "Basic " + localStorage.token,
            }   
        };
        const response = await api.get("/transaction-user/" + id, config);
        return response.data
    });

    const [message, setMessage] = useState(null);    
    const [preview, setPreview] = useState(null); //For image preview
    const [form, setForm] = useState({
      image: "",
      number_pay: "",            
    }); 

    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
      });
  
      // preview
      if (e.target.type === "file") {
        let url = URL.createObjectURL(e.target.files[0]);
        setPreview(url);
      }
    };

    const handleSubmit = useMutation(async (e) => {
        try {
          e.preventDefault();
    
          // Store data with FormData as object
          const formData = new FormData();
          formData.set("image", form?.image[0], form?.image[0]?.name);
          formData.set("idFilms", showIdFilm);
          formData.set("idUser", id);      
          formData.set("number_pay", form.number_pay);      
    
          // Configuration
          const config = {
            method: "POST",
            headers: {
              Authorization: "Basic " + localStorage.token,
            },
            body: formData,
          };
              
            const response = await api.post("/transaction", config);
          
            if (response.status === "success") {                             
                refetch()          
                handleClose()
                handleShow3()
            } else {
                const alert = (
                    <Alert variant="danger" className="py-1">
                        Failed success
                    </Alert>
                );
                setMessage(alert);
            }

        } catch (error) {
          console.log(error);
        }
    });

    return (        
        <>
            <div className="container">
                <NavbarLogin/>  
                <Modal show={show3} onHide={handleClose3} centered>                 
                    <Modal.Body className="d-flex" style={{ color:'#469F74', height:'7rem', justifyContent: 'center', alignItems:'center' }}>
                        <div className="container text-center">
                            please wait admin response
                        </div> 
                    </Modal.Body>                  
                </Modal> 
                {transaction?.length !== 0 ? (
                    <>
                    {transaction?.slice(-1).map((item) => (
                            <div>                                
                                {(() => {
                                    if (item.status_pay == 'Approved') {
                                        return(
                                            <>
                                                <DetailAfter/>
                                            </>
                                        )
                                    } else if(item.status_pay == 'Pending') {
                                        return(
                                            <>
                                                {detail?.map((item) => (                                                          
                                                    <div className="row my-4">
                                                        <div className="col-4 d-flex" style={{ justifyContent: 'center' }}>
                                                            <img src={item.image} style={{height: '20rem', width:'13rem', objectFit: 'cover' }}/>                           
                                                        </div>
                                                        <div className="col">
                                                            <div className="row">
                                                                <div className="col-6">
                                                                    <span style={{ fontWeight: 'bolder', letterSpacing: '1px', fontSize: 'xx-large' }}>{item.title}</span>
                                                                </div>                                                                                           
                                                            </div>
                                                            <div onClick={() => handleShow2()} className="row my-4" style={{ position: 'relative', cursor:'pointer' }}>                            
                                                                <img src={item.image} style={{ objectFit: 'cover', height: '15rem', width:'100%', opacity: 0.3 }}/>
                                                                <span className="d-flex" style={{ justifyContent: 'center', position: 'absolute', top: '40%', fontSize: '50px' }}>
                                                                    <FontAwesomeIcon icon={faPlay} />
                                                                </span>
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
                                                <Modal show={show2} onHide={handleClose2} aria-labelledby="contained-modal-title-vcenter" centered>                 
                                                    <Modal.Body className="d-flex" style={{ color:'#469F74', height:'7rem', justifyContent: 'center', alignItems:'center' }}>
                                                        <div className="container text-center">
                                                            please wait admin response
                                                        </div> 
                                                    </Modal.Body>                  
                                                </Modal>
                                            </> 
                                        )
                                    } else if(item.status_pay == 'Cancel'){
                                        return(
                                            <>
                                                {detail?.map((item) => (                                                          
                                                    <div className="row my-4">
                                                        <div className="col-4 d-flex" style={{ justifyContent: 'center' }}>
                                                            <img src={item.image} style={{height: '20rem', width:'13rem', objectFit: 'cover' }}/>                           
                                                        </div>
                                                        <div className="col">
                                                            <div className="row">
                                                                <div className="col-6">
                                                                    <span style={{ fontWeight: 'bolder', letterSpacing: '1px', fontSize: 'xx-large' }}>{item.title}</span>
                                                                </div>
                                                                <div className="col-6 d-flex" style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                                                                    <span onClick={() => handleShow(item)} className="px-4 py-2" style={{ cursor: 'pointer', backgroundColor: '#CD2E71', borderRadius: '5px', fontWeight: 'bolder'}}>Buy Now</span>                                        
                                                                </div>                            
                                                            </div>
                                                            <div onClick={() => handleShow2()} className="row my-4" style={{ position: 'relative', cursor:'pointer' }}>                            
                                                                <img src={item.image} style={{ objectFit: 'cover', height: '15rem', width:'100%', opacity: 0.3 }}/>
                                                                <span className="d-flex" style={{ justifyContent: 'center', position: 'absolute', top: '40%', fontSize: '50px' }}>
                                                                    <FontAwesomeIcon icon={faPlay} />
                                                                </span>
                                                            </div>
                                                            <div className="d-flex flex-row my-3">                            
                                                                {item.categories?.map((item) => (
                                                                    <span className="text-muted pe-2" style={{ fontWeight: 'bolder'}}>{item.category}</span>                                        
                                                                ))}
                                                            </div>
                                                            <div className="row my-3">                            
                                                                <span style={{ fontWeight: 'bolder', color: '#CD2E71' }}>{toRupiah(item.price, {dot: ',', formal: false, floatingPoint: 0})}</span>
                                                            </div>
                                                            <div className="row my-3">                            
                                                                <span className="text-sm-start" >
                                                                    {item.desc}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>  
                                                ))} 
                                                <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>                 
                                                    <Modal.Body className="bg-dark">
                                                        <div className="container">
                                                            <div className="row mt-2 mb-4">
                                                                <span className="d-flex" style={{ justifyContent: 'center', fontWeight: 'bolder', fontSize: '30px' }}>
                                                                    Cinema<span style={{ color: '#CD2E71' }}>Online</span>: {show.filmId}
                                                                </span>
                                                            </div>
                                                            <div className="row my-2">
                                                                <span style={{ fontWeight: 'bolder', fontSize: '20px' }}>
                                                                    {show.title}
                                                                </span>
                                                            </div>
                                                            <div className="row my-2">
                                                                <span>
                                                                    Total: <span style={{ color: '#CD2E71', fontWeight: 'bolder' }}>Rp. {show.price}</span>
                                                                </span>
                                                            </div>
                                                            <div className="row my-2">
                                                                <form onSubmit={(e) => handleSubmit.mutate(e)} enctype="multipart/form-data">                
                                                                    <div className="mb-3">                
                                                                        <input 
                                                                            type="number" 
                                                                            className="form-control bg-dark text-white p-3" 
                                                                            placeholder="Input Your Account Number"
                                                                            name="number_pay" 
                                                                            onChange={handleChange} 
                                                                        />
                                                                    </div>
                                                                    {preview && (
                                                                        <div className="mb-3" >
                                                                            <img
                                                                                src={preview}
                                                                                style={{
                                                                                    width: "5rem",
                                                                                    height: "5rem",
                                                                                    objectFit: "cover",
                                                                                }}
                                                                                alt="preview"
                                                                            />
                                                                        </div>
                                                                    )} 
                                                                    <div className="mb-4">
                                                                        <label htmlFor="formFile" className="form-label text-center text-white" >                            
                                                                            <span className="px-2 py-2" style={{ cursor: 'pointer', backgroundColor: '#CD2E71', borderRadius: '5px', fontWeight: 'bolder'}}>Attach Payment</span>                                                                      
                                                                        </label>                 
                                                                        <input className 
                                                                            type="file" 
                                                                            style={{display: 'none'}} 
                                                                            id="formFile"  
                                                                            name="image" 
                                                                            onChange={handleChange}                           
                                                                        />                                
                                                                        <span className="text-muted ms-2">*transfers can be made accounts</span>
                                                                    </div>
                                                                    <div>              
                                                                        <button type="submit" className="text-center" style={{background: '#CD2E71', borderRadius: '5px', border: 'none', color: 'white', textDecoration: 'none', paddingTop: '1rem', paddingBottom: '1rem', paddingLeft: '3rem', paddingRight: '3rem', display: 'block', width: '100%'}}>              
                                                                            <span style={{color: 'white', fontSize: '17px'}}>
                                                                                <b>Pay</b>
                                                                            </span>              
                                                                        </button>
                                                                    </div>
                                                                </form>   
                                                            </div>
                                                        </div> 
                                                    </Modal.Body>                  
                                                </Modal>
                                                <Modal show={show2} onHide={handleClose2} aria-labelledby="contained-modal-title-vcenter" centered>                 
                                                    <Modal.Body className="d-flex" style={{ color:'#469F74', height:'7rem', justifyContent: 'center', alignItems:'center' }}>
                                                        <div className="container text-center">
                                                            please buy this film if you want to watch
                                                        </div> 
                                                    </Modal.Body>                  
                                                </Modal>
                                            </> 
                                        )
                                    } else{
                                        return(
                                            <>
                                                {detail?.map((item) => (                                                          
                                                    <div className="row my-4">
                                                        <div className="col-4 d-flex" style={{ justifyContent: 'center' }}>
                                                            <img src={item.image} style={{height: '20rem', width:'13rem', objectFit: 'cover' }}/>                           
                                                        </div>
                                                        <div className="col">
                                                            <div className="row">
                                                                <div className="col-6">
                                                                    <span style={{ fontWeight: 'bolder', letterSpacing: '1px', fontSize: 'xx-large' }}>{item.title}</span>
                                                                </div>
                                                                <div className="col-6 d-flex" style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                                                                    <span onClick={() => handleShow(item)} className="px-4 py-2" style={{ cursor: 'pointer', backgroundColor: '#CD2E71', borderRadius: '5px', fontWeight: 'bolder'}}>Buy Now</span>                                        
                                                                </div>                            
                                                            </div>
                                                            <div onClick={() => handleShow2()} className="row my-4" style={{ position: 'relative', cursor:'pointer' }}>                            
                                                                <img src={item.image} style={{ objectFit: 'cover', height: '15rem', width:'100%', opacity: 0.3 }}/>
                                                                <span className="d-flex" style={{ justifyContent: 'center', position: 'absolute', top: '40%', fontSize: '50px' }}>
                                                                    <FontAwesomeIcon icon={faPlay} />
                                                                </span>
                                                            </div>
                                                            <div className="d-flex flex-row my-3">                            
                                                                {item.categories?.map((item) => (
                                                                    <span className="text-muted pe-2" style={{ fontWeight: 'bolder'}}>{item.category}</span>                                        
                                                                ))}
                                                            </div>
                                                            <div className="row my-3">                            
                                                                <span style={{ fontWeight: 'bolder', color: '#CD2E71' }}>{toRupiah(item.price, {dot: ',', formal: false, floatingPoint: 0})}</span>
                                                            </div>
                                                            <div className="row my-3">                            
                                                                <span className="text-sm-start" >
                                                                    {item.desc}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>  
                                                ))} 
                                                <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>                 
                                                    <Modal.Body className="bg-dark">
                                                        <div className="container">
                                                            <div className="row mt-2 mb-4">
                                                                <span className="d-flex" style={{ justifyContent: 'center', fontWeight: 'bolder', fontSize: '30px' }}>
                                                                    Cinema<span style={{ color: '#CD2E71' }}>Online</span>: {show.filmId}
                                                                </span>
                                                            </div>
                                                            <div className="row my-2">
                                                                <span style={{ fontWeight: 'bolder', fontSize: '20px' }}>
                                                                    {show.title}
                                                                </span>
                                                            </div>
                                                            <div className="row my-2">
                                                                <span>
                                                                    Total: <span style={{ color: '#CD2E71', fontWeight: 'bolder' }}>Rp. {show.price}</span>
                                                                </span>
                                                            </div>
                                                            <div className="row my-2">
                                                                <form onSubmit={(e) => handleSubmit.mutate(e)} enctype="multipart/form-data">                
                                                                    <div className="mb-3">                
                                                                        <input 
                                                                            type="number" 
                                                                            className="form-control bg-dark text-white p-3" 
                                                                            placeholder="Input Your Account Number"
                                                                            name="number_pay" 
                                                                            onChange={handleChange} 
                                                                        />
                                                                    </div>
                                                                    {preview && (
                                                                        <div className="mb-3" >
                                                                            <img
                                                                                src={preview}
                                                                                style={{
                                                                                    width: "5rem",
                                                                                    height: "5rem",
                                                                                    objectFit: "cover",
                                                                                }}
                                                                                alt="preview"
                                                                            />
                                                                        </div>
                                                                    )} 
                                                                    <div className="mb-4">
                                                                        <label htmlFor="formFile" className="form-label text-center text-white" >                            
                                                                            <span className="px-2 py-2" style={{ cursor: 'pointer', backgroundColor: '#CD2E71', borderRadius: '5px', fontWeight: 'bolder'}}>Attach Payment</span>                                                                      
                                                                        </label>                 
                                                                        <input className 
                                                                            type="file" 
                                                                            style={{display: 'none'}} 
                                                                            id="formFile"  
                                                                            name="image" 
                                                                            onChange={handleChange}                           
                                                                        />                                
                                                                        <span className="text-muted ms-2">*transfers can be made accounts</span>
                                                                    </div>
                                                                    <div>              
                                                                        <button type="submit" className="text-center" style={{background: '#CD2E71', borderRadius: '5px', border: 'none', color: 'white', textDecoration: 'none', paddingTop: '1rem', paddingBottom: '1rem', paddingLeft: '3rem', paddingRight: '3rem', display: 'block', width: '100%'}}>              
                                                                            <span style={{color: 'white', fontSize: '17px'}}>
                                                                                <b>Pay</b>
                                                                            </span>              
                                                                        </button>
                                                                    </div>
                                                                </form>   
                                                            </div>
                                                        </div> 
                                                    </Modal.Body>                  
                                                </Modal>
                                                <Modal show={show2} onHide={handleClose2} aria-labelledby="contained-modal-title-vcenter" centered>                 
                                                    <Modal.Body className="d-flex" style={{ color:'#469F74', height:'7rem', justifyContent: 'center', alignItems:'center' }}>
                                                        <div className="container text-center">
                                                            please buy this film if you want to watch
                                                        </div> 
                                                    </Modal.Body>                  
                                                </Modal>
                                            </> 
                                        )
                                    }
                                })()}
                            </div>
                        ))}                                   
                    </>
                ) : (                  
                  <>
                    {detail?.map((item) => (                                                          
                        <div className="row my-4">
                            <div className="col-4 d-flex" style={{ justifyContent: 'center' }}>
                                <img src={item.image} style={{height: '20rem', width:'13rem', objectFit: 'cover' }}/>                           
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col-6">
                                        <span style={{ fontWeight: 'bolder', letterSpacing: '1px', fontSize: 'xx-large' }}>{item.title}</span>
                                    </div>
                                    <div className="col-6 d-flex" style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <span onClick={() => handleShow(item)} className="px-4 py-2" style={{ cursor: 'pointer', backgroundColor: '#CD2E71', borderRadius: '5px', fontWeight: 'bolder'}}>Buy Now</span>                                        
                                    </div>                            
                                </div>
                                <div onClick={() => handleShow2()} className="row my-4" style={{ position: 'relative', cursor:'pointer' }}>                            
                                    <img src={item.image} style={{ objectFit: 'cover', height: '15rem', width:'100%', opacity: 0.3 }}/>
                                    <span className="d-flex" style={{ justifyContent: 'center', position: 'absolute', top: '40%', fontSize: '50px' }}>
                                        <FontAwesomeIcon icon={faPlay} />
                                    </span>
                                </div>
                                <div className="d-flex flex-row my-3">                            
                                    {item.categories?.map((item) => (
                                        <span className="text-muted pe-2" style={{ fontWeight: 'bolder'}}>{item.category}</span>                                        
                                    ))}
                                </div>
                                <div className="row my-3">                            
                                    <span style={{ fontWeight: 'bolder', color: '#CD2E71' }}>{toRupiah(item.price, {dot: ',', formal: false, floatingPoint: 0})}</span>
                                </div>
                                <div className="row my-3">                            
                                    <span className="text-sm-start" >
                                        {item.desc}
                                    </span>
                                </div>
                            </div>
                        </div>  
                    ))} 
                    <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>                 
                        <Modal.Body className="bg-dark">
                            <div className="container">
                                <div className="row mt-2 mb-4">
                                    <span className="d-flex" style={{ justifyContent: 'center', fontWeight: 'bolder', fontSize: '30px' }}>
                                        Cinema<span style={{ color: '#CD2E71' }}>Online</span>: {show.filmId}
                                    </span>
                                </div>
                                <div className="row my-2">
                                    <span style={{ fontWeight: 'bolder', fontSize: '20px' }}>
                                        {show.title}
                                    </span>
                                </div>
                                <div className="row my-2">
                                    <span>
                                        Total: <span style={{ color: '#CD2E71', fontWeight: 'bolder' }}>Rp. {show.price}</span>
                                    </span>
                                </div>
                                <div className="row my-2">
                                    <form onSubmit={(e) => handleSubmit.mutate(e)} enctype="multipart/form-data">                
                                        <div className="mb-3">                
                                            <input 
                                                type="number" 
                                                className="form-control bg-dark text-white p-3" 
                                                placeholder="Input Your Account Number"
                                                name="number_pay" 
                                                onChange={handleChange} 
                                            />
                                        </div>
                                        {preview && (
                                            <div className="mb-3" >
                                                <img
                                                    src={preview}
                                                    style={{
                                                        width: "5rem",
                                                        height: "5rem",
                                                        objectFit: "cover",
                                                    }}
                                                    alt="preview"
                                                />
                                            </div>
                                        )} 
                                        <div className="mb-4">
                                            <label htmlFor="formFile" className="form-label text-center text-white" >                            
                                                <span className="px-2 py-2" style={{ cursor: 'pointer', backgroundColor: '#CD2E71', borderRadius: '5px', fontWeight: 'bolder'}}>Attach Payment</span>                                                                      
                                            </label>                 
                                            <input className 
                                                type="file" 
                                                style={{display: 'none'}} 
                                                id="formFile"  
                                                name="image" 
                                                onChange={handleChange}                           
                                            />                                
                                            <span className="text-muted ms-2">*transfers can be made accounts</span>
                                        </div>
                                        <div>              
                                            <button type="submit" className="text-center" style={{background: '#CD2E71', borderRadius: '5px', border: 'none', color: 'white', textDecoration: 'none', paddingTop: '1rem', paddingBottom: '1rem', paddingLeft: '3rem', paddingRight: '3rem', display: 'block', width: '100%'}}>              
                                                <span style={{color: 'white', fontSize: '17px'}}>
                                                    <b>Pay</b>
                                                </span>              
                                            </button>
                                        </div>
                                    </form>   
                                </div>
                            </div> 
                        </Modal.Body>                  
                    </Modal>
                    <Modal show={show2} onHide={handleClose2} aria-labelledby="contained-modal-title-vcenter" centered>                 
                        <Modal.Body className="d-flex" style={{ color:'#469F74', height:'7rem', justifyContent: 'center', alignItems:'center' }}>
                            <div className="container text-center">
                                please buy this film if you want to watch
                            </div> 
                        </Modal.Body>                  
                    </Modal> 
                  </>                  
                )}                                                                                                      
            </div>            
        </>
    )
}
  
export default DetailFilm;