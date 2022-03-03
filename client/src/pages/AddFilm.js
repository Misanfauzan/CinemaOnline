import React, { useState, useEffect} from "react"

import "../assets/css/all.css"

import 'bootstrap'

import { Alert, Modal } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPaperclip, faPlus } from '@fortawesome/free-solid-svg-icons'

import { useQuery, useMutation } from "react-query";

import NavbarAdmin from './helper/NavbarAdmin'

import { API } from "../config/api";

function AddFilm() {  
    const title = "Add Film";
    document.title = "CinemaOnline | " + title;

    let api = API();        

    const [dataCategory, setDataCategory] = useState(); 

    let { data: categories } = useQuery("categoryCache", async () => {
        const config = {
          method: "GET",
          headers: {
            Authorization: "Basic " + localStorage.token,
          },
        };
        const response = await api.get("/categories", config);
        setDataCategory(response.data)
    }); 
    
    const [message, setMessage] = useState(null);    
    const [preview, setPreview] = useState(null); //For image preview
    const [categoryId, setCategoryId] = useState([]); //Save the selected category id
    const [form, setForm] = useState({
      image: "",
      title: "",      
      desc: "",      
      price: "",      
      link: "",      
    }); 

    const handleChangeCategory = (e) => {
        const id = e.target.value;
    
        setCategoryId([...categoryId, parseInt(id)]);        
    };

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
          formData.set("title", form.title);
          formData.set("desc", form.desc);        
          formData.set("price", form.price);        
          formData.set("link", form.link);        
          formData.set("categoryId", categoryId);        
    
          // Configuration
          const config = {
            method: "POST",
            headers: {
              Authorization: "Basic " + localStorage.token,
            },
            body: formData,
          };
              
          const response = await api.post("/film", config);
          
            if (response.status === "success") {            

            const alert = (
                <Alert variant="success" className="py-1">
                    Add Film Success
                </Alert>
            );
                setMessage(alert);            
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

    const [select, setSelect] = useState([{}]);    

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...select];
        list.splice(index, 1);
        setSelect(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setSelect([...select, {}]);
    };

    const [show, setShow] = useState(false);    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);    

    const [form1, setForm1] = useState({
        category: "",             
    }); 

    const { category } = form1

    const handleChange1 = (e) => {
        setForm1({
          ...form1,
          [e.target.name]: e.target.value,
        });            
    };

    const handleSubmit1 = useMutation(async (e) => {
        try {
          e.preventDefault();
          
          const body = JSON.stringify(form1)
    
          // Configuration
          const config = {
            method: "POST",
            headers: {
              Authorization: "Basic " + localStorage.token,
              "Content-Type": "application/json"
            },
            body,
          };
              
          const response = await api.post("/category", config);
          
            if (response.status === "success") {            
                handleClose()
                setDataCategory([...dataCategory, response.data])
            } 

        } catch (error) {
          console.log(error);
        }
    }); 

    return (        
        <>
            <div className="container">
                <NavbarAdmin/>                                            
                {message && message} 
                <div className="container-fluid"> 
                    <div className="row mx-2 my-4">
                        <span style={{ fontWeight: 'bolder', fontSize: 'xx-large' }}>
                            Add Film
                        </span>
                    </div>                                                                         
                    <div className="row mx-2 my-4">
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
                            <div className="input-group mb-3 d-flex flex-row" style={{ alignItems: 'center' }}>
                                <div className="col-9">
                                    <input 
                                        type="text" 
                                        placeholder="Title" 
                                        className="bg-dark form-control" 
                                        style={{color: 'white'}} 
                                        name="title" 
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">                                                                    
                                    <div className="input-group" style={{ justifyContent: 'flex-end' }}>
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            id="inputGroupFile02" 
                                            style={{ display: 'none' }} 
                                            name="image" 
                                            onChange={handleChange}
                                        />
                                        <label className="input-group-text" htmlFor="inputGroupFile02" style={{ backgroundColor: '#212529', color: 'white', paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
                                            Attach Thumbnail <FontAwesomeIcon icon={faPaperclip} style={{ color: 'red' }} />
                                        </label>
                                    </div>
                                </div>                                
                            </div>                                                                                                
                            {select.map((x, i) => {
                                return (
                                    <>
                                        <div className="input-group mb-3">  
                                            <select className="bg-dark form-select" id="inputGroupSelect01" style={{color: 'white'}} 
                                            name="categoryId" 
                                            onChange={handleChangeCategory}
                                        >                                                                                                             
                                            <option selected>Choose Category...</option>
                                            {dataCategory?.map((item) => (
                                                <option value={item.id}>{item.category}</option> 
                                            ))}                                                                                                         
                                            </select>     
                                            <button className="text-center ms-2" style={{background: '#CD2E71', border: 'solid', borderColor: '#CD2E71' , color: 'white', textDecoration: 'none', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem'}}
                                            onClick={handleShow}
                                            >              
                                                <span style={{color: 'white', fontSize: '17px'}}>
                                                    <b>Add Category</b>
                                                </span>              
                                            </button>                                                                                           
                                            {select.length !== 1 &&                                                 
                                                <button className="text-center ms-2" style={{background: '#CD2E71', border: 'solid', borderColor: '#CD2E71' , color: 'white', textDecoration: 'none', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem'}}
                                                onClick={() => handleRemoveClick(i)}
                                                >              
                                                    <span style={{color: 'white', fontSize: '17px'}}>
                                                        <FontAwesomeIcon icon={faMinus} />
                                                    </span>              
                                                </button> 
                                            }
                                            {select.length - 1 === i && 
                                                <button className="text-center ms-2" style={{background: '#CD2E71', border: 'solid', borderColor: '#CD2E71' , color: 'white', textDecoration: 'none', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem'}}
                                                onClick={handleAddClick}
                                                >              
                                                    <span style={{color: 'white', fontSize: '17px'}}>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </span>              
                                                </button> 
                                            
                                            }
                                        </div>                                                                                                                      
                                    </>
                                )
                            })}                                     
                            <div className="mb-3">
                                <input 
                                    type="number" 
                                    placeholder="Price" 
                                    className="bg-dark form-control" 
                                    style={{color: 'white'}} 
                                    name="price" 
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <input 
                                    type="text" 
                                    placeholder="Link" 
                                    className="bg-dark form-control" 
                                    style={{color: 'white'}} 
                                    name="link" 
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">                        
                                <textarea 
                                    placeholder="Description" 
                                    className="form-control bg-dark" 
                                    id="exampleFormControlTextarea1" 
                                    rows={3} style={{ color: 'white'}} 
                                    // defaultValue={''} 
                                    name="desc" 
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mt-5 mb-3 d-flex justify-content-end align-items-end">
                                <button 
                                    className="text-center"
                                    style={{ backgroundColor: '#CD2E71', borderRadius: '5px', border: 'none', color: 'white', textDecoration: 'none', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem'}}
                                    type="submit"
                                >                                                  
                                    Add Film                                                                                
                                </button>                                                                         
                            </div>
                        </form>
                    </div>
                </div>                                                                       
            </div>
            <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>                 
                <Modal.Body className="bg-dark">
                    <div className="container">
                        <div className="row mt-3">
                            <h1 style={{ color: '#CD2E71' }}><b>Add New Category</b></h1>
                        </div>
                        <div className="row mt-1 mb-2">
                            <form onSubmit={(e) => handleSubmit1.mutate(e)} >
                                <div className="mt-4 mb-4">                
                                    <input 
                                        type="text" 
                                        className="form-control bg-dark text-white p-3" 
                                        placeholder="Category Name" 
                                        name="category"
                                        onChange={handleChange1}
                                    />                
                                </div>                                             
                                <div className="mb-3">              
                                    <button type="submit" className="text-center" style={{background: '#CD2E71', borderRadius: '5px', border: 'none', color: 'white', textDecoration: 'none', paddingTop: '1rem', paddingBottom: '1rem', paddingLeft: '3rem', paddingRight: '3rem', display: 'block', width: '100%'}}>              
                                        <span style={{color: 'white', fontSize: '17px'}}>
                                            <b>Add New Category</b>
                                        </span>              
                                    </button>                 
                                </div>
                            </form>
                        </div>
                    </div> 
                </Modal.Body>                  
            </Modal>
        </>
    )
}
  
export default AddFilm;