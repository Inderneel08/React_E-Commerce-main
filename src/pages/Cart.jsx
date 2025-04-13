import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import {load} from '@cashfreepayments/cashfree-js';

const Cart = () => {
  const state = useSelector((state) => state.handleCart);

  const isAuthenticated = useSelector((state) => state.auth);

  const [cartItems,setCartItems] = useState([]);

  const [cartItemsLoading,setCartItemsLoading] = useState(true);

  const [totalAmount,setTotalAmount] = useState(0);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const submitForm = async (event) =>{
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost/laravel-backend/api/auth/createOrder",{
        totalAmount,
      },{
        withCredentials: true,
      });

      const data = response.data.data;

      if(response.status==200){
        let checkoutOptions = {
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_modal",
        }

        const cashfree = await load({
          mode:"sandbox"
        });

          try {
            const result = await cashfree.checkout(checkoutOptions);

            if (result.error) {
              // Swal.fire({
              //   title:"Error",
              //   icon:"error",
              //   text:"Error in processing the payment",
              //   didClose: () => {
              //     navigate("/");
              //   }
              // });

              console.log("User has closed the popup or there is some payment error, Check for Payment Status");
              console.log(result.error);
            } else if (result.redirect) {
              console.log("Payment will be redirected");
            } else if (result.paymentDetails) {
              console.log("Payment has been completed, Check for Payment Status");

              Swal.fire({
                title:"Success",
                icon:"success",
                text:"Payment has been processed",
                didClose: () => {
                  navigate("/");
                }
              });

              console.log(result.paymentDetails.paymentMessage);
            }
        } catch (checkoutError) {
          console.error("Checkout process failed: ", checkoutError);
        }
      }
      else{
        Swal.fire({
          title: 'Error',
          text:'Error',
          icon:'error',
        });
      }

    } catch (error) {

      if(error.status==302){
        navigate('/profile');
      }
      else{

        if(error.response.status==402){
          Swal.fire({
            title: 'Error',
            text:error.response.data.message,
            icon:'error',
          });
        }
      }
    }
  };

  const fetchCartInfo = async () => {
    try {
      const response = await axios.get("http://localhost/laravel-backend/api/auth/getCartItems",{
        withCredentials:true,
      });

      setCartItems(response.data.cartItems);

      setTotalAmount(response.data.totalCost);

      setCartItemsLoading(false);

      // console.log(response);
    } catch (error) {
      if(error.response.status==401){
        setCartItemsLoading(false)
      }

      console.error();
    }
  }

  const EmptyCart = () => {

    if(cartItemsLoading){
        return(
          <>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </>
        );
    }
    else{
      if (isAuthenticated && cartItems.length > 0) {
        // let subtotal = 0;
        let shipping = 30.0;
        let totalItems = 0;

        cartItems.forEach((item) => {
          // subtotal += item.price * item.count;
          totalItems += item.count;
        });

        return (
          <section className="h-100 gradient-custom">
            <div className="container py-5">
              <div className="row d-flex justify-content-center my-4">
                <div className="col-md-8">
                  <div className="card mb-4">
                    <div className="card-header py-3">
                      <h5 className="mb-0">Item List</h5>
                    </div>
                    <div className="card-body">
                      {cartItems.map((item) => (
                        <div key={item.id}>
                          <div className="row d-flex align-items-center">
                            <div className="col-lg-3 col-md-12">
                              <div
                                className="bg-image rounded"
                                data-mdb-ripple-color="light"
                              >
                                <img
                                  src={`http://localhost/laravel-backend/public/${item.image}`}
                                  alt={item.title}
                                  width={100}
                                  height={75}
                                />
                              </div>
                            </div>

                            <div className="col-lg-5 col-md-6">
                              <p>
                                <strong>{item.title}</strong>
                              </p>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div
                                className="d-flex mb-4"
                                style={{ maxWidth: "300px" }}
                              >
                                <button
                                  className="btn px-3"
                                  onClick={() => removeItem(item)}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>

                                <p className="mx-5">{item.count}</p>

                                <button
                                  className="btn px-3"
                                  onClick={() => addItem(item)}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>

                              <p className="text-start text-md-center">
                                <strong>
                                  <span className="text-muted">{item.count}</span> x ${item.price}
                                </strong>
                              </p>
                            </div>
                          </div>
                          <hr className="my-4" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card mb-4">
                    <div className="card-header py-3 bg-light">
                      <h5 className="mb-0">Order Summary</h5>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                          Products ({totalItems})<span>${Math.round(totalAmount)}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                          Shipping
                          <span>${shipping}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                          <div>
                            <strong>Total amount</strong>
                          </div>
                          <span>
                            <strong>${Math.round(totalAmount + shipping)}</strong>
                          </span>
                        </li>
                      </ul>

                      <button
                        className="btn btn-dark btn-lg btn-block"
                        onClick={submitForm}
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }
      else{
        return (
            <div className="container">
              <div className="row">
                <div className="col-md-12 py-5 bg-light text-center">
                  <h4 className="p-3 display-5">Your Cart is Empty</h4>
                  <Link to="/" className="btn  btn-outline-dark mx-4">
                    <i className="fa fa-arrow-left"></i> Continue Shopping
                  </Link>
                </div>
            </div>
          </div>
        );
      }
    }
  };

  useEffect(() => {
    if(isAuthenticated){

      fetchCartInfo();
    }
  },[])


  const addToCart = async (product) => {
    try {
      const response = await axios.post("http://localhost/laravel-backend/api/auth/addToCart",product,{
        withCredentials: true
      })

    } catch (error) {
      console.error();
    }
  }


  const addItem = async (product) => {

    if(isAuthenticated){
      setCartItemsLoading(true);
      await addToCart(product); // Wait for it to finish first
      await fetchCartInfo();    // Then refetch updated cart
    }
    else{
      dispatch(addCart(product));
    }
  };

  const deleteItem = async (product) => {
    try {
      const response = await axios.post("http://localhost/laravel-backend/api/auth/removeFromCart",product,{
        withCredentials: true
      })

    } catch (error) {
      console.error();
    }
  }

  const removeItem = async (product) => {
    if(isAuthenticated){
      setCartItemsLoading(true);
      await deleteItem(product);
      await fetchCartInfo();
    }
    else{
      dispatch(delCart(product));
    }
  };

  const ShowCart = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;
    state.map((item) => {
      return (subtotal += item.price * item.qty);
    });

    state.map((item) => {
      return (totalItems += item.qty);
    });
    return (
      <>
        <section className="h-100 gradient-custom">
          <div className="container py-5">
            <div className="row d-flex justify-content-center my-4">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header py-3">
                    <h5 className="mb-0">Item List</h5>
                  </div>
                  <div className="card-body">
                    {state.map((item) => {
                      return (
                        <div key={item.id}>
                          <div className="row d-flex align-items-center">
                            <div className="col-lg-3 col-md-12">
                              <div
                                className="bg-image rounded"
                                data-mdb-ripple-color="light"
                              >
                                <img
                                  src={item.image}
                                  // className="w-100"
                                  alt={item.title}
                                  width={100}
                                  height={75}
                                />
                              </div>
                            </div>

                            <div className="col-lg-5 col-md-6">
                              <p>
                                <strong>{item.title}</strong>
                              </p>
                              {/* <p>Color: blue</p>
                              <p>Size: M</p> */}
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div
                                className="d-flex mb-4"
                                style={{ maxWidth: "300px" }}
                              >
                                <button
                                  className="btn px-3"
                                  onClick={() => {
                                    removeItem(item);
                                  }}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>

                                <p className="mx-5">{item.qty}</p>

                                <button
                                  className="btn px-3"
                                  onClick={() => {
                                    addItem(item);
                                  }}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>

                              <p className="text-start text-md-center">
                                <strong>
                                  <span className="text-muted">{item.qty}</span>{" "}
                                  x ${item.price}
                                </strong>
                              </p>
                            </div>
                          </div>

                          <hr className="my-4" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-header py-3 bg-light">
                    <h5 className="mb-0">Order Summary</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                        Products ({totalItems})<span>${Math.round(subtotal)}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                        Shipping
                        <span>${shipping}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                        <div>
                          <strong>Total amount</strong>
                        </div>
                        <span>
                          <strong>${Math.round(subtotal + shipping)}</strong>
                        </span>
                      </li>
                    </ul>

                    <Link
                      to="/checkout"
                      className="btn btn-dark btn-lg btn-block"
                    >
                      Go to checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Cart</h1>
        <hr />
        {state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
