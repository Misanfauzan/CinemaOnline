import React, {useContext, useState} from "react"

import "../../assets/css/all.css"

import 'bootstrap'
import { Alert } from "react-bootstrap"

import { useMutation } from "react-query";
import { UserContext } from "../../context/userContext";

import { API } from "../../config/api";

function RegisterModal() {
    let api = API();

    const [state, dispatch] = useContext(UserContext);

    const [message, setMessage] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { name, email, password } = form;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitRegister = useMutation(async (e) => {
        try {
            e.preventDefault();

            // Data body
            const body = JSON.stringify(form);

            // Configuration Content-type
            const config = {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: body,
            };

            // Insert data user to database
            const response = await api.post("/register", config);

            console.log(response);

            // Notification
            if (response.status === "success") {
                const alert = (
                <Alert variant="success" className="py-1">
                    Success, Go To Login
                </Alert>
                );
                setMessage(alert);       
            } else {
                const alert = (
                <Alert variant="danger" className="py-1">
                    Failed Register
                </Alert>
                );
                setMessage(alert);
            }
        } catch (error) {
        const alert = (
            <Alert variant="danger" className="py-1">
            Failed
            </Alert>
        );
            setMessage(alert);
            console.log(error);
        }
    });

    return (     
        <>                                        
            <form onSubmit={(e) => handleSubmitRegister.mutate(e)}>
                {message && message}        
                <div className="mt-4 mb-4">                
                    <input 
                    type="email" 
                    className="form-control bg-dark text-white p-3" 
                    id="exampleInputEmail1" 
                    aria-describedby="emailHelp" 
                    placeholder="Email" 
                    value={email}
                    name="email"
                    onChange={handleChange}
                    />                
                </div>                                
                <div className="mb-4">                
                    <input 
                    type="password" 
                    className="form-control bg-dark text-white p-3" 
                    id="exampleInputPassword1" 
                    placeholder="Password" 
                    value={password}
                    name="password"
                    onChange={handleChange} 
                    />
                </div>   
                <div className="mb-5">                
                    <input 
                    type="text" 
                    className="form-control bg-dark text-white p-3" 
                    id="exampleInputEmail1" 
                    aria-describedby="emailHelp" 
                    placeholder="Name" 
                    value={name}
                    name="name"
                    onChange={handleChange}
                    />                
                </div>           
                <div className="mb-3">              
                    <button className="text-center" style={{background: '#CD2E71', borderRadius: '5px', border: 'none', color: 'white', textDecoration: 'none', paddingTop: '1rem', paddingBottom: '1rem', paddingLeft: '3rem', paddingRight: '3rem', display: 'block', width: '100%'}}>              
                    <span style={{color: 'white', fontSize: '17px'}}>
                        <b>Register</b>
                    </span>              
                    </button>                 
                </div>
            </form>          
        </>
  )
}

export default RegisterModal;