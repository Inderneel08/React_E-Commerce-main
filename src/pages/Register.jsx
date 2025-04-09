import React, { useState } from 'react'
import { Footer, Navbar } from "../components";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import SHA256 from "crypto-js/sha256";




const Register = () => {
    const [name,setName] = useState('');

    const [email,setEmail] = useState('');

    const [password,setPassword] = useState('');

    const [confirmPassword,setconfirmPassword] = useState('');

    const hashSHA256 = async (input) => {
        return SHA256(input).toString();
    };

    const submitButtonClicked = async(event) => {
        event.preventDefault();

        if(password != confirmPassword){
            Swal.fire({
                title: 'Error!',
                icon: 'error',
                text : 'Both the passwords do not match',
            });

            return(false);
        }

        if(password=='' || confirmPassword=='' || name=='' || email==''){
            Swal.fire({
                title: 'Error!',
                icon: 'error',
                text : 'None of the input fields can be empty.',
            });

            return(false);
        }

        const hashedPassword = await hashSHA256(password);

        const hashedConfirmPassword = await hashSHA256(confirmPassword);

        try {
            const response = await axios.post('http://localhost/laravel-backend/api/auth/register',{
                name,
                email,
                password: hashedPassword,
                confirmPassword : hashedConfirmPassword
            });

            if(response.status==200){
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                }).then(() => {
                    window.location.reload();
                });
            }
            else{
                Swal.fire({
                    title:'Error',
                    text: response.data.message,
                    icon:'error',
                }).then(() => {
                    window.location.reload();
                });
            }

        } catch (error) {
            console.error('Error during registration:', error.response?.data || error.message);

            alert('Registration failed. Please try again.');
        }
    }


    const changeInput = (e,input) => {

        const setters = {
            name: setName,
            email: setEmail,
            password: setPassword,
            confirmPassword: setconfirmPassword
        };

        if(setters[input]){
            setters[input](e.target.value);
        }
    }

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Register</h1>
                <hr />
                <div className="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form>
                            <div className="form my-3">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    placeholder="Enter Your Name"
                                    value={name}
                                    onChange={(e) => changeInput(e,"name")}
                                />
                            </div>
                            <div className="form my-3">
                                <label htmlFor="email">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => changeInput(e,"email")}
                                />
                            </div>
                            <div className="form  my-3">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => changeInput(e,"password")}
                                />
                            </div>
                            <div className="form  my-3">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Password"
                                    value={confirmPassword}
                                    onChange={(e) => changeInput(e,"confirmPassword")}
                                />
                            </div>
                            <div className="my-3">
                                <p>Already has an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                            </div>
                            <div className="text-center">
                                <button className="my-2 mx-auto btn btn-dark" type="submit" onClick={submitButtonClicked}>
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register
