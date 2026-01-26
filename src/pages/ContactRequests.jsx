import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate } from "react-router-dom"; // import useNavigate
import { useSelector } from 'react-redux'

const ContactRequests = () => {
  const { role_user } = useSelector((state) => state.auth);

  const navigate = useNavigate(); // initialize navigate

  const fetchContactRequest = async() => {
    console.log(123);
  }

    useEffect(() => {
        if(role_user!=1){
            navigate("/");
        }

        fetchContactRequest();
    },[role_user]);


    return(
    <>
        <Navbar />

          <div className="container my-3 py-3">
            <h1 className="text-center">Contact Requests</h1>
            <hr />
            <div className="row my-4 h-100">
              <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
              </div>
            </div>
          </div>

        <Footer />
    </>);

};



export default ContactRequests;