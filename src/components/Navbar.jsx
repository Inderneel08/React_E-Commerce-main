import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { logoutForm } from '../redux/action' 
import axios from 'axios'
import Swal from 'sweetalert2'
import { clearCart } from '../redux/action'
import { fetchCartCount } from '../redux/action';

const Navbar = () => {
    const state = useSelector(state => state.handleCart)

    const dispatch = useDispatch();

    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    const {cartCount,cartLoading} = useSelector(state => state.cartCount);

    const logoutProcess = async () => {
        const [message,status] = await dispatch(logoutForm());

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
    }

    // console.log(isAuthenticated);

    useEffect(() => {

        const checkAuth = async () =>{
            try {
                const res = await axios.get("http://localhost/laravel-backend/api/auth/check", {
                    withCredentials:true
                });

                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: res.data, // Assuming API returns user data
                });

                dispatch(clearCart());
            } catch (error) {
                dispatch({
                    type: "LOGIN_FAILURE",
                    payload: error.message, // Assuming API returns user data
                });
            }
        }

        // const getCartInfo = async () =>{
        //     try {
        //         const response = await axios.get("http://localhost/laravel-backend/api/auth/getCartInfo", {
        //             withCredentials:true
        //         });

        //         setCartCount(response.data.cartCount);

        //         setCartLoading(false);

        //     } catch (error) {
        //         if(error.response.status==401){
        //             setCartLoading(false);
        //         }

        //         console.error();
        //     }
        // }

        checkAuth();

        dispatch(fetchCartCount());

    },[dispatch]);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/"> React Ecommerce</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/product">Products</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>
                    </ul>
                    {/* <div className="buttons text-center">
                        {!isAuthenticated?(
                            <>
                                <NavLink to="/login" className="btn btn-outline-dark m-2"><i className="fa fa-sign-in-alt mr-1"></i> Login</NavLink>
                                <NavLink to="/register" className="btn btn-outline-dark m-2"><i className="fa fa-user-plus mr-1"></i> Register</NavLink>
                                <NavLink to="/cart" className="btn btn-outline-dark m-2"><i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length}) </NavLink>
                            </>
                        ):(
                            <>
                                <NavLink className="btn btn-outline-dark m-2" onClick={logoutProcess}><i className="fa fa-sign-in-alt mr-1"></i>Logout</NavLink>
                            </>
                        )}

                    </div> */}

                    <div className="dropdown d-inline">
                        {(loading || cartLoading) ? (
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        ) : !isAuthenticated ? (
                        <>
                            <NavLink to="/login" className="btn btn-outline-dark m-2">Login</NavLink>
                            <NavLink to="/register" className="btn btn-outline-dark m-2">Register</NavLink>
                            <NavLink to="/cart" className="btn btn-outline-dark m-2">
                            <i className="fa fa-cart-shopping mr-1"></i> Cart ({ state.length})
                            </NavLink>
                        </>
                        ) : (
                        <div className="d-flex align-items-center">
                            <div className="dropdown">
                            <button className="btn btn-outline-dark dropdown-toggle d-flex align-items-center" type="button" id="profileDropdown" data-bs-toggle="dropdown">
                                <i className="fa fa-user-circle me-2"></i> Profile
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                                <li><NavLink className="dropdown-item" to="/profile">Profile</NavLink></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><NavLink className="dropdown-item" to="/changePassword">Change Password</NavLink></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                <button className="dropdown-item text-danger" onClick={logoutProcess}>Logout</button>
                                </li>
                            </ul>
                            </div>
                            <NavLink to="/cart" className="btn btn-outline-dark m-2">
                            <i className="fa fa-cart-shopping mr-1"></i> Cart ({cartCount})
                            </NavLink>
                        </div>
                        )}
                    </div>
                </div>


            </div>
        </nav>
    )
}

export default Navbar
