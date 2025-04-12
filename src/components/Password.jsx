import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import SHA256 from "crypto-js/sha256";

const Password = () => {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

    const hashSHA256 = async (input) => {
        return SHA256(input).toString();
    };

  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/");
    }
  }, [isAuthenticated, loading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    const hashedPayload = {
        current_password: await hashSHA256(formData.current_password),
        new_password: await hashSHA256(formData.new_password),
        confirm_password: await hashSHA256(formData.confirm_password),
    };


    if (formData.new_password !== formData.confirm_password) {
      Swal.fire({
        icon: 'error',
        title: 'Mismatch',
        text: 'New password and Confirm password do not match.',
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost/laravel-backend/api/auth/updatePassword", hashedPayload, {
        withCredentials: true
      });

      Swal.fire({
        icon: response.status==200 ? 'success' : 'error',
        title: response.status==200 ? 'Success' : 'Error',
        text: response.data.message,
      });

      if (response.status==200) {
        setFormData({
          current_password: "",
          new_password: "",
          confirm_password: ""
        });
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Something went wrong.',
      });
    }
  };

  return (
    <>
      {isAuthenticated && (
        <div className="container py-5">
          <h2 className="mb-4">Change Password</h2>
          <form className="row g-3" onSubmit={handlePasswordUpdate}>
            <div className="col-md-12">
              <label htmlFor="current_password" className="form-label">Current Password</label>
              <input type="password" className="form-control" id="current_password" name="current_password" required value={formData.current_password} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label htmlFor="new_password" className="form-label">New Password</label>
              <input type="password" className="form-control" id="new_password" name="new_password" required value={formData.new_password} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label htmlFor="confirm_password" className="form-label">Confirm New Password</label>
              <input type="password" className="form-control" id="confirm_password" name="confirm_password" required value={formData.confirm_password} onChange={handleChange} />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">Update Password</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Password;
