import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer, Navbar } from "../components";
import Swal from 'sweetalert2';
import SHA256 from "crypto-js/sha256";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { submitLoginForm } from "../redux/action";

const Login = () => {
  const [email,setEmail] = useState('');

  const [password,setPassword] = useState('');

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  console.log(authState);

  // useEffect(() => {
  //   if(isAuthenticated){

  //     navigate("/");
  //   }
  // },[isAuthenticated]);


  const hashSHA256 = async (input) => {
    return SHA256(input).toString();
  };

  const submitButton = async (event) => {
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
      const [message,status] = await dispatch(submitLoginForm(email,hashedPassword));

      if(status==200){
        Swal.fire({
          title:'Success',
          text: message,
          icon:'success',
        });
      }
      else{
        Swal.fire({
          title:'Error',
          text: message,
          icon:'error',
        });
      }

      return ;
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text:'Error',
        icon:'error',
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
                <button className="my-2 mx-auto btn btn-dark" type="submit" onClick={submitButton}>
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
