import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import Swal from 'sweetalert2';
import axios from "axios";
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom"; // import useNavigate
import api from "../api/axios";
const ContactPage = () => {

  const [name,setName] = useState("");

  const [email,setEmail] = useState("");

  const [message,setMessage] = useState("");

  const { role_user } = useSelector((state) => state.auth);

  const navigate = useNavigate(); // initialize navigate


  useEffect(() => {
    if(role_user!=0){
      navigate("/");
    }
  },[role_user])

  const submitCheckoutForm = async(event) =>{
    try {
      event.preventDefault();
      // http://localhost:8080/api/auth/createQuery
      const response = await api.post("createQuery",{
        name,
        email,
        message
      },{
        withCredentials: true,
      });

      if(response.status===200){
        Swal.fire({
          title:'Success',
          text:response.data,
          icon:'success',
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: 'Error',
        text:'Error',
        icon:'error',
      });
    }
  }

    return (
    <>
      {role_user == 0 && (
        <>
          <Navbar />
          <div className="container my-3 py-3">
            <h1 className="text-center">Contact Us</h1>
            <hr />
            <div className="row my-4 h-100">
              <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                <form onSubmit={submitCheckoutForm}>
                  <div className="form my-3">
                    <label htmlFor="Name">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Name"
                      placeholder="Enter your name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form my-3">
                    <label htmlFor="Email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="Email"
                      placeholder="name@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form  my-3">
                    <label htmlFor="Message">Message</label>
                    <textarea
                      rows={5}
                      className="form-control"
                      id="Message"
                      placeholder="Enter your message"
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      className="my-2 px-4 mx-auto btn btn-dark"
                      type="submit"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );

};

export default ContactPage;
