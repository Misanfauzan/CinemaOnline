import React, {useState, useEffect} from "react"

import "../assets/css/all.css"

import 'bootstrap'
import { Modal } from "react-bootstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faCompass, faHeart, faHome, faPaperPlane, faPlay, faPlusSquare, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { useNavigate, useParams, Link } from "react-router-dom"

import { useQuery, useMutation } from "react-query";
import ReactDOM from 'react-dom';

import NavbarLogin from './helper/NavbarLogin'
import { API } from "../config/api";
import dateFormat, { masks } from "dateformat";
import toRupiah from '@develoka/angka-rupiah-js';
import { UserContext } from "../context/userContext";

function Profile() {  
    const title = "Profile";
    document.title = "CinemaOnline | " + title;
  
    // useNavigate declare
    const navigate = useNavigate()
         
    let api = API();            
         
    let { data: transaction } = useQuery("transactionCache", async () => {
        const config = {
            method: "GET",     
            headers: {
                Authorization: "Basic " + localStorage.token,
            }   
        };
        const response = await api.get("/transaction-id", config);
        return response.data
    });
    
    let { data: userId, refetch } = useQuery("userIdCache", async () => {
        const config = {
            method: "GET",     
            headers: {
                Authorization: "Basic " + localStorage.token,
            }   
        };
        const response = await api.get("/user", config);
        setUsers(response.data)
    });     

    const [preview, setPreview] = useState(null)
    const [form, setForm] = useState({
        image: "",
        name: "",
        phone: "",
        email: "",   
    })

    const [user, setUser] = useState({})
    
    let { userRefetch } = useQuery("userCache", async () => {
        const config = {
          headers: {
            Authorization: "Basic " + localStorage.token,
          },
        };
        const response = await api.get("/user" , config);
        setForm({
          image: response.data.image,
          name: response.data.name,
          phone: response.data.phone,
          email: response.data.email,
        });
        setUser(response.data);
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
        });    

        // Create image url for preview
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
          formData.set("name", form?.name);
          formData.set("phone", form?.phone);
          formData.set("email", form?.email);
    
          // Configuration
          const config = {
            method: "PATCH",
            headers: {
              Authorization: "Basic " + localStorage.token,
            },
            body: formData,
          };
    
            const response = await api.patch("/user", config);            
            if (response.status === "success") {            
                switchText()  
                setUsers(response.data)
            }
        } catch (error) {
          console.log(error);
        }
    });    
    
    const [input, setInput] = useState(false);
    const switchInput = () => {
        setInput(true);
    };

    const switchText = () => {
        setInput(false);
    };            

    const [users, setUsers] = useState({}); 
    console.log(users)
    return (        
        <>
            <div className="container">
                <NavbarLogin/>                                                            
                <div className="row my-4">
                    <div className="col-6" style={{ justifyContent: 'center' }}>
                        <div className="row">
                            <span style={{ fontWeight: 'bolder', fontSize: 'xx-large' }}>
                                My Profile
                            </span>
                        </div>
                        {input ? 
                            <>
                                <div className="row my-4">
                                    <div className="col-5">
                                        <img src={users.image} style={{height: '15rem', width:'12rem', objectFit:'cover' }}/>                           
                                    </div>
                                    <div className="col mx-4">
                                        <div className="d-flex flex-column">
                                            <form onSubmit={(e) => handleSubmit.mutate(e)} enctype="multipart/form-data">
                                                {preview && (
                                                    <div className="d-flex mb-3" style={{ justifyContent: 'flex-end' }}>
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
                                                <div class="pb-2">
                                                    <div className="row">
                                                        <label htmlFor="formFile" className="form-label text-center text-white" style={{background: '#CD2E71', borderRadius: '5px', border: 'none', color: 'white', textDecoration: 'none', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem', cursor: 'pointer'}}>                            
                                                            <span style={{color: 'white'}}>
                                                                <b>Upload Profile Image</b>
                                                            </span>                                          
                                                        </label>                 
                                                        <input 
                                                            className="form-control" 
                                                            id="formFile" 
                                                            style={{display: 'none'}} 
                                                            type="file" 
                                                            name="image"                                                             
                                                            onChange={handleChange}                                                             
                                                        />                                                        
                                                    </div>                                                    
                                                </div>  
                                                <div class="pb-2">
                                                    <div className="row pb-2">
                                                        <span style={{ fontWeight: 'bolder', color: '#CD2E71', padding: '0', margin:'0' }}>Name</span>
                                                            <input 
                                                                type="text" 
                                                                placeholder="Name" 
                                                                className="bg-dark form-control" 
                                                                style={{color: 'white'}} 
                                                                value={form.name}
                                                                name="name"
                                                                onChange={handleChange} 
                                                            />
                                                    </div>
                                                </div> 
                                                <div class="pb-2">
                                                    <div className="row pb-2">
                                                        <span style={{ fontWeight: 'bolder', color: '#CD2E71', padding: '0', margin:'0' }}>Email</span>
                                                            <input 
                                                                type="email" 
                                                                placeholder="Email" 
                                                                className="bg-dark form-control" 
                                                                style={{color: 'white'}} 
                                                                value={form.email}
                                                                name="email"
                                                                onChange={handleChange} 
                                                            />
                                                    </div>
                                                </div> 
                                                <div class="pb-2">
                                                    <div className="row pb-2">
                                                        <span style={{ fontWeight: 'bolder', color: '#CD2E71', padding: '0', margin:'0' }}>Phone</span>
                                                            <input 
                                                                type="number" 
                                                                placeholder="Phone Number" 
                                                                className="bg-dark form-control" 
                                                                style={{color: 'white'}} 
                                                                value={form.phone}
                                                                name="phone"
                                                                onChange={handleChange} 
                                                            />
                                                    </div>
                                                </div>   
                                                <div class="pb-2 d-flex flex-row justify-content-end align-items-end">
                                                    <div className="row pe-5">
                                                        <button className="text-center" style={{background: 'none', border: 'none', color: 'white', textDecoration: 'none', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem'}}
                                                            onClick={switchText}
                                                        >              
                                                            <span style={{color: 'white', fontSize: '17px'}}>
                                                                <b>Cancel</b>
                                                            </span>              
                                                        </button> 
                                                    </div> 
                                                    <div className="row">
                                                        <button className="text-center" style={{background: '#CD2E71', borderRadius: '5px', border: 'none', color: 'white', textDecoration: 'none', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem'}}
                                                            type="submit"
                                                        >              
                                                            <span style={{color: 'white', fontSize: '17px'}}>
                                                                <b>Save</b>
                                                            </span>              
                                                        </button> 
                                                    </div>                                                     
                                                </div>                                            
                                            </form>
                                        </div>
                                    </div>
                                </div>                                
                            </>
                        : 
                            <>
                                <div className="row my-4">
                                    <div className="col-5">
                                        <img onClick={switchInput} src={users.image} style={{cursor: 'pointer', height: '15rem', width:'12rem', objectFit:'cover' }}/>                           
                                    </div>
                                    <div className="col">
                                        <div className="d-flex flex-column">
                                            <span style={{ fontWeight: 'bolder', color: '#CD2E71' }}>Name</span>
                                            <span className="text-muted" onClick={switchInput} style={{ cursor: 'pointer' }}>{users.name}</span>
                                            <span className="mt-4" style={{ fontWeight: 'bolder', color: '#CD2E71' }}>Email</span>
                                            <span className="text-muted" onClick={switchInput} style={{ cursor: 'pointer' }}>{users.email}</span>
                                            <span className="mt-4" style={{ fontWeight: 'bolder', color: '#CD2E71' }}>Phone</span>
                                            <span className="text-muted" onClick={switchInput} style={{ cursor: 'pointer' }}>{users.phone ?? 'Please Input Your Number'}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }                        
                    </div>
                    <div className="col-6">                        
                        <div className="row">                            
                            <span style={{ fontWeight: 'bolder', letterSpacing: '1px', fontSize: 'xx-large' }}>
                                History Transaction
                            </span>                                                                                  
                        </div>                        
                        {transaction?.map((item) => (
                        <div className="row my-4">                            
                            <div className="card" style={{width: '100%', backgroundColor: '#3D0E22'}}>
                                <div className="card-body">
                                    <div className="row">                                            
                                        <div class="d-flex flex-column">
                                            <span style={{ fontWeight: 'bolder', fontSize:'25px' }}>{item.films.title}</span>
                                            <span>{dateFormat(item.updatedAt, "dddd, mmmm d yyyy")}</span>
                                            <span className="mt-4" style={{ fontWeight: 'bolder', color: '#CD2E71' }}>Total: {toRupiah(item.films.price, {dot: ',', formal: false, floatingPoint: 0})}</span>
                                        </div>                                            
                                        <div className="d-flex" style={{ justifyContent: 'flex-end' }}>
                                            {(() => {
                                                if(item.status_pay == 'Approved'){
                                                    return(
                                                        <span className="bg-success bg-opacity-75 d-flex" style={{ alignItems:'center',justifyContent: 'center',height: '2.5rem', width: '10rem',cursor: 'pointer', fontWeight: 'bolder', color:'#00FF47'}}>
                                                            Finished
                                                        </span>
                                                    )   
                                                } else if(item.status_pay == 'Pending'){
                                                    return(
                                                        <span className="bg-warning bg-opacity-75 d-flex" style={{ alignItems:'center',justifyContent: 'center',height: '2.5rem', width: '10rem',cursor: 'pointer', fontWeight: 'bolder', color:'yellow'}}>
                                                            Pending
                                                        </span> 
                                                    )  
                                                } else if(item.status_pay == 'Cancel'){
                                                    return(
                                                        <span className="bg-danger bg-opacity-75 d-flex" style={{ alignItems:'center',justifyContent: 'center',height: '2.5rem', width: '10rem', cursor: 'pointer', fontWeight: 'bolder', color:'red'}}>
                                                            Canceled
                                                        </span>  
                                                    ) 
                                                } 
                                            })()}                                     
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>   
                        ))}                     
                    </div>
                </div>                                                                             
            </div>            
        </>
    )
}
  
export default Profile;