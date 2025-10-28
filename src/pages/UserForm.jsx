import React, { useState, useEffect } from "react";

import '../app.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../component/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

function UserForm() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [teamLeaderList, setTeamLeaderList] = useState([]);
    const [selectedTeamLeader, setSelectedTeamLeader] = useState("");
    const [deviceLogin, setDeviceLogin] = useState("");
    const [crmAccess, setCrmAccess] = useState("");



    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name,
            email,
            phone,
            gender,
            role,
            teamleader: role === "3" ? selectedTeamLeader : "",
            crm_app_access: crmAccess,
            login_device: deviceLogin,
        };
        // console.log("send data", formData)
        try {
            const res = await api.post(`/add-user`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (res.data.status === 200) {
                toast.success("User added successfully");
                resetForm();
            } else {
                toast.error("Failed to add user");
            }
        } catch (error) {
            toast.error("Error submitting form");
        }
    };

    const resetForm = () => {
        setName("");
        setPhone("");
        setGender("");
        setEmail("");
        setRole("");
        setSelectedTeamLeader("");
        setCrmAccess("");
        setDeviceLogin("");
    };

    const getteamLeader = async () => {
        try {
            const resTL = await axios.get("https://api.almonkdigital.in/api/admin/get-team-leader", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            if (resTL.status === 200) {
                setTeamLeaderList(resTL.data.data)
                // console.log(resTL.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="container">
            <h2 className="mb-4 text-center textsize headingstyle">Add User</h2>
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
                {/* Personal Details Section */}
                <div className="border rounded p-3 mb-4">
                    <h5 className="mb-3">Personal Details</h5>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="form-control"
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Contact Number</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                maxLength="10"
                                required
                                className="form-control"
                                placeholder="Contact Number"
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Gender</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                placeholder="Email"
                            />
                        </div>
                    </div>
                </div>

                {/* Login Details Section */}
                <div className="border rounded p-3 mb-4">
                    <h5 className="mb-3">Login Details</h5>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Login Role</label>
                            <select
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    getteamLeader()
                                }}
                                className="form-select"
                            >
                                <option value="">Select Role</option>
                                <option value="1">Admin</option>
                                <option value="2">Team Leader</option>
                                <option value="3">Agent</option>
                            </select>
                        </div>

                        {role === "3" && (
                            <div className="col-md-6 mb-3">
                                <label>Select Team Leader</label>
                                <select
                                    value={selectedTeamLeader}
                                    onChange={(e) => setSelectedTeamLeader(e.target.value)}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select Team Leader</option>
                                    {teamLeaderList.map((leader) => (
                                        <option key={leader.user_id} value={leader.user_id}>
                                            {leader.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="col-md-6 mb-3">
                            <label>CRM/APP Access</label>
                            <select
                                value={crmAccess}
                                onChange={(e) => setCrmAccess(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Select</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Single Device Login Validation</label>
                            <select
                                value={deviceLogin}
                                onChange={(e) => setDeviceLogin(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Select</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="text-end">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="btn btn-secondary me-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Save
                    </button>
                </div>
            </form >
            <ToastContainer />
        </div >
    );
}

export default UserForm;
