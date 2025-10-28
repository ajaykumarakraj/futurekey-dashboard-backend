import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../app.css';
import api from "../component/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function UpdateUserForm() {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [teamLeaderList, setTeamLeaderList] = useState([]);
    const [selectedTeamLeader, setSelectedTeamLeader] = useState("");
    const [deviceLogin, setDeviceLogin] = useState("");
    const [crmAccess, setCrmAccess] = useState("");

    useEffect(() => {
        const loadUserDetails = async () => {
            try {
                const res = await api.get(`/get-user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (res.data.status === 200 && typeof res.data.data === "object") {
                    const user = res.data.data;
                    // console.log("get data", user)
                    setName(user.name || "");
                    setPhone(user.phone || "");
                    setGender(user.gender || "");
                    setEmail(user.email || "");
                    setRole(String(user.role));
                    setSelectedTeamLeader(user.team_leader_id !== "NA" ? user.team_leader_id : "");
                    setCrmAccess(user.crm_app_access);
                    setDeviceLogin(user.login_device);
                    setTeamLeaderList(user.all_team_leader || []);
                } else {
                    toast.error("Unexpected user response");
                }
            } catch (error) {
                toast.error("Error loading user");
            }
        };

        loadUserDetails();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = {
            user_id: id,
            name,
            email,
            phone,
            gender,
            role,
            teamleader: role === "3" ? selectedTeamLeader : "",
            crm_app_access: crmAccess,
            login_device: deviceLogin,
        };
        // console.log("post", formData)
        try {
            const res = await api.post(`/update-user`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.data.status === 200) {
                // console.log(res.data)
                toast.success("User updated successfully");
            } else {
                toast.error("Failed to update user");
            }
        } catch (error) {
            toast.error("Error submitting form");
        }
    };
    // console.log("deviceLogin", id)
    return (
        <div className="container">
            <h2 className="mb-4 text-center textsize">Edit User</h2>
            <form onSubmit={handleUpdate} className="p-4 border rounded shadow bg-white">
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
                            {role === "1" ? (
                                <select value={role} disabled className="form-select">
                                    <option value="1">Admin</option>
                                </select>
                            ) : (
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">Select Role</option>
                                    <option value="2">Team Leader</option>
                                    <option value="3">Agent</option>
                                </select>
                            )}
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
                                        <option key={leader.team_leader_id} value={leader.team_leader_id}>
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
                                <option value="">select</option>
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
                    <button type="submit" className="btn btn-primary px-4">
                        Save
                    </button>
                </div>
            </form >
            <ToastContainer />
        </div >
    );
}

export default UpdateUserForm;
