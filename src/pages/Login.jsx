import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Footer, Navbar } from "../components";
import axios from 'axios';
import Swal from 'sweetalert2';
import SHA256 from "crypto-js/sha256";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email,setEmail] = useState('');

  const [password,setPassword] = useState('');

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const hashSHA256 = async (input) => {
    return SHA256(input).toString();
  };

  const submitLoginForm = async (event) => {
    event.preventDefault();

    if(email == '' || password == ''){
      Swal.fire({
        title: 'Error!',
        icon: 'error',
        text : 'None of the input fields can be empty.',
      });

      return(false);
    }

    const hashedPassword = await hashSHA256(password);


    try {
      const response = await axios.post('http://localhost:5000/api/auth/login',{
        email,
        password: hashedPassword,
      });

      if(response.status==200){
        Swal.fire({
          title:'Success',
          text: response.data.message,
          icon:'success',
        }).then(() => {

        });
      }

    } catch (error) {
      console.error('Error during signin:', error.response?.data || error.message);

      Swal.fire({
        icon:'error',
        title: error.response.data.message,
      });
    }

  }

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form>
              <div className="my-3">
                <label htmlFor="floatingInput">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  onChange={(e)=> setEmail(e.target.value)}
                />
              </div>
              <div className="my-3">
                <label htmlFor="floatingPassword">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="my-3">
                <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link> </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit" onClick={submitLoginForm}>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
