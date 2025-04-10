import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfileData = () => {
  const [states, setStates] = useState([]);

  const [profileData, setProfileData] = useState({});

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get("http://localhost/laravel-backend/api/getStates");
        setStates(response.data.states || []);
      } catch (error) {
        console.error("Failed to fetch states:", error);
      }
    };

    fetchStates();

  }, []);

    useEffect(() => {
        if(!isAuthenticated){
            navigate("/");
        }
    },[isAuthenticated]);

  useEffect(() => {
    const fetchProfileData = async () => {
        try {
            const response = await axios.get("http://localhost/laravel-backend/api/auth/findProfileInfo", {
                withCredentials:true
            });

            setProfileData(response.data.profileInfo || {});
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    fetchProfileData();

},[isAuthenticated])

    return (
    <>
        {isAuthenticated && (
        <div className="container py-5">
            <h2 className="mb-4">Profile Information</h2>
            <form className="row g-3">
            <div className="col-md-12">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" required value={profileData.name || ""} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} readOnly />
            </div>

            <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" required value={profileData.email || ""} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} readOnly />
            </div>

            <div className="col-md-6">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input type="number" className="form-control" id="phone" value={profileData.phone || ""} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
            </div>

            <div className="col-md-12">
                <label htmlFor="address" className="form-label">Address</label>
                <input type="text" className="form-control" id="address" required value={profileData.address || ""} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} />
            </div>

            <div className="col-md-6">
                <label htmlFor="state" className="form-label">State</label>
                <select id="state" className="form-select" required value={profileData.state || ""} onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}>
                <option value="">Choose...</option>
                {states.map((state) => (
                    <option key={state.id} value={state.id}>{state.state_name}</option>
                ))}
                </select>
            </div>

            <div className="col-md-6">
                <label htmlFor="zip" className="form-label">Zip</label>
                <input type="text" className="form-control" id="zip" required value={profileData.zip || ""} onChange={(e) => setProfileData({ ...profileData, zip: e.target.value })} />
            </div>

            <div className="col-12">
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
            </form>
        </div>
        )}
    </>
    );

};

export default ProfileData;
