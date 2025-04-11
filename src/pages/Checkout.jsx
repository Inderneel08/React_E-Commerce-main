// Keep this part the same
import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector,useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import {load} from '@cashfreepayments/cashfree-js';
import { clearCart } from "../redux/action";

const Checkout = () => {
  const dispatch = useDispatch();

  const state = useSelector((state) => state.handleCart);

  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get("http://localhost/laravel-backend/api/getStates");
        setStates(response.data.states || []);
      } catch (error) {
        console.error("Failed to fetch states:", error);
        setStates([]);
      }
    };
    fetchStates();
  }, []);

  const EmptyCart = () => (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">
          <h4 className="p-3 display-5">No item in Cart</h4>
          <Link to="/" className="btn btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  const ShowCheckout = ({ state, states }) => {
    const [currentState, setCurrentState] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [address2, setAddress2] = useState("");
    const [zip, setZip] = useState("");
    const [phone,setPhone] = useState("");

    useEffect(() => {
      if(firstName!="" && lastName!="" && email!="" && address!="" && zip!=""){
        document.getElementById('checkoutSubmit').disabled=false;
      }

    },[firstName,lastName,email,address,address2,zip]);


    const submitCheckoutForm = async (event) => {
      try {
        event.preventDefault();

        const response = await axios.post("http://localhost/laravel-backend/api/auth/createOrder",{
          firstName,
          lastName,
          email,
          currentState,
          address,
          address2,
          zip,
          phone,
          subtotal,
          state,
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
                console.log("User has closed the popup or there is some payment error, Check for Payment Status");
                console.log(result.error);
              } else if (result.redirect) {
                console.log("Payment will be redirected");
              } else if (result.paymentDetails) {
                console.log("Payment has been completed, Check for Payment Status");
                console.log(result.paymentDetails.paymentMessage);
                dispatch(clearCart());
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
        console.log(error);

        Swal.fire({
          title: 'Error',
          text:'Error',
          icon:'error',
        });
      }
    }

    const shipping = 30.0;

    const [subtotalCalc,subtotal, totalItems] = React.useMemo(() => {
      const subtotalCalc = state.reduce((acc, item) => acc + item.price * item.qty, 0);
      const itemsCount = state.reduce((acc, item) => acc + item.qty, 0);
      return [subtotalCalc,subtotalCalc+shipping, itemsCount];
    }, [state]);


    return (
      <div className="container py-5">
        <div className="row my-4">
          {/* Order Summary */}
          <div className="col-md-5 col-lg-4 order-md-last">
            <div className="card mb-4">
              <div className="card-header py-3 bg-light">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Products ({totalItems})<span>${Math.round(subtotalCalc)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    Shipping<span>${shipping}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                    <strong>Total amount</strong>
                    <span><strong>${Math.round(subtotal)}</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Billing Form */}
          <div className="col-md-7 col-lg-8">
            <div className="card mb-4">
              <div className="card-header py-3">
                <h4 className="mb-0">Billing address</h4>
              </div>
              <div className="card-body">
                <form className="needs-validation" noValidate onSubmit={submitCheckoutForm}>
                  <div className="row g-3">
                    <div className="col-sm-6 my-1">
                      <label className="form-label">First name</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>

                    <div className="col-sm-6 my-1">
                      <label className="form-label">Last name</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>

                    <div className="col-sm-12 my-1">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="col-12 my-1">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="col-12 my-1">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="1234 Main St"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="col-12 my-1">
                      <label className="form-label">Address 2 (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Apartment or suite"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6 my-1">
                      <label className="form-label">State</label>
                      <select
                        className="form-select"
                        required
                        value={currentState}
                        onChange={(e) => setCurrentState(e.target.value)}
                      >
                        <option value="">Choose...</option>
                        {states.map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.state_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 my-1">
                      <label className="form-label">Zip</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                      />
                    </div>
                  </div>

                  <hr className="my-4" />
                  <button className="w-100 btn btn-primary" id="checkoutSubmit" type="submit" disabled={true}>
                    Continue to checkout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? (
          <ShowCheckout state={state} states={states} />
        ) : (
          <EmptyCart />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
