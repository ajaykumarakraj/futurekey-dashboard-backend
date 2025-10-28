import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../component/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../app.css"
import { useAuth } from "../component/AuthContext";

const CreateForm = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [number, setNumber] = useState("");
  const [altnumber, setAltnumber] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [city, setCity] = useState("");
  const [remark, setRemark] = useState('');
  const [selectCustomer, setSelectCustomer] = useState("");
  // requirement  
  const [requirement, setRequirement] = useState("");
  const [require, setRequire] = useState([])

  // lead source 
  const [leadSourceList, setLeadSourceList] = useState([])
  const [leadSource, setLeadSource] = useState("");

  // project 
  const [selectproject, setSelectProject] = useState("");
  const [projectList, setProjectList] = useState([]);


  // team Leader
  const [teamLeader, setTeamLeader] = useState("");
  const [teamleaderId, setTeamLeaderId] = useState("");

  // agent
  const [agentid, setAgentId] = useState("")
  const [agent, setAgent] = useState([]);


  const [statedata, setState] = useState([])


  const genderData = ["Male", "Female", "Other"];

  const customerTypeData = ["Dealer", "Customer"];





  useEffect(() => {
    Requirment();
    teamLeaderfn();
    state();
  }, [])




  const state = async () => {
    try {
      const resstate = await axios.get("https://api.almonkdigital.in/api/state-list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if (resstate.status === 200) {
        // console.log("state", resstate.data.data)
        setState(resstate.data.data)
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  const teamLeaderfn = async () => {
    try {
      const teamleaderres = await axios.get("https://api.almonkdigital.in/api/admin/get-team-leader", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (teamleaderres.status === 200) {
        // console.log(teamleaderres.data.data)
        setTeamLeader(teamleaderres.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  };
  const Requirment = async () => {
    try {
      const response = await axios.get('https://api.almonkdigital.in/api/admin/view-master-setting', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if (response.status === 200) {

        const getData = response.data.data
        // console.log(getData)
        setRequire(getData.filter(item => item.cat_name === "Require Measurement"))
        setProjectList(getData.filter(item => item.cat_name === "Project"))
        setLeadSourceList(getData.filter(item => item.cat_name === "Lead Source"))
      }
    } catch (error) {
      toast.error(error);
    }
  }
  const handleFilterChange = async (e) => {
    const teamleaderId = e.target.value
    setTeamLeaderId(teamleaderId)
    // console.log("id", teamleaderId)
    try {
      const agentRes = await axios.get(`https://api.almonkdigital.in/api/admin/get-agent/${teamleaderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if (agentRes.status === 200) {
        // console.log("agent", agentRes.data.data)
        setAgent(agentRes.data.data)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleAgentId = (e) => {
    const AgentId = e.target.value
    // console.log("AgentId", AgentId)
    setAgentId(AgentId)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !number || !selectedGender || !selectedState || !leadSource || !selectproject) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = {
      user_id: user.user_id,
      name,
      contact: number,
      alt_contact: altnumber,
      gender: selectedGender,
      state: selectedState,
      city,
      requirement,
      lead_source: leadSource,
      customer_type: selectCustomer,
      project: selectproject,
      remark,
      team_leader: teamleaderId,
      agent: agentid,
    };
    // console.log("create lead", formData)
    try {
      const res = await api.post("https://api.almonkdigital.in/api/create-customer", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Client added successfully!");
      setName("");
      setSelectedGender("");
      setAgent("");
      setTeamLeader("");
      setSelectProject("");
      setLeadSource("");
      setRequirement("");
      setSelectCustomer("");
      setSelectedState("");
      setCity("");
      setAltnumber("");
      setNumber("");
      setRemark("");

    } catch (error) {
      toast.error("Failed to add client. Try again.");
    }
  };
  // console.log("check", user)
  // console.log("vdgfdgf", statedata)
  return (
    <div className="container">
      <h2 className="mb-4 text-center textsize headingstyle">Create New Lead</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white ">

        <div className="formstart">
          {/* Personal Details Section */}
          <div className="border rounded p-3 mb-4">
            <h5 className="mb-3">Personal Details</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name *" />
              </div>
              <div className="col-md-6 mb-3">
                <select className="form-select" value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                  <option value="">Select Gender *</option>
                  {genderData.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <input className="form-control" type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Mobile No. *" />
              </div>
              <div className="col-md-6 mb-3">
                <input className="form-control" type="text" value={altnumber} onChange={(e) => setAltnumber(e.target.value)} placeholder="Alt Mobile No." />
              </div>
            </div>
          </div>



          {/* Lead Details Section */}
          <div className="border rounded p-3 mb-4">
            <h5 className="mb-3">Lead Details</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <select className="form-select" value={selectCustomer} onChange={(e) => setSelectCustomer(e.target.value)}>
                  <option value="">Customer Type</option>
                  {customerTypeData.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <select className="form-select" value={requirement} onChange={(e) => setRequirement(e.target.value)}>
                  <option value="">Requirement</option>
                  {require.map((r) => (
                    <option key={r.id} value={r.cat_value}>
                      {r.cat_value}
                    </option>))
                  }
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <select className="form-select" value={leadSource} onChange={(e) => setLeadSource(e.target.value)}>
                  <option value="">Lead Source *</option>

                  {leadSourceList.map((r) => (
                    <option key={r.id} value={r.cat_value}>
                      {r.cat_value}
                    </option>))
                  }
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <select className="form-select" value={selectproject} onChange={(e) => setSelectProject(e.target.value)}>
                  <option value="">Project *</option>
                  {projectList.map((r) => (
                    <option key={r.id} value={r.cat_value}>
                      {r.cat_value}
                    </option>))
                  }

                </select>
              </div>
              <div className="col-12 mb-3">
                <textarea className="form-control" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Remarks..." rows="2" />
              </div>
            </div>
          </div>
          {/* Address Section */}
          <div className="border rounded p-3 mb-4">
            <h5 className="mb-3">Address</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <select className="form-select" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                  <option value="">Select State *</option>
                  {Array.isArray(statedata) && statedata.map((v, key) => (
                    <option value={v.state} key={key}>{v.state}</option>
                  ))
                  }
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <input className="form-control" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
              </div>
            </div>
          </div>
          {/* Assign Lead Section */}
          <div className="border rounded p-3 mb-4">
            <h5 className="mb-3">Assign Lead</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <select className="form-select" onChange={handleFilterChange} >
                  <option >Select TeamLeader</option>
                  {

                    Array.isArray(teamLeader) && teamLeader.map((value, key) =>
                      <option key={key} value={value.user_id}>{value.name}</option>
                    )
                  }


                </select>
              </div>
              <div className="col-md-6 mb-3">
                <select className="form-select" onChange={handleAgentId} >
                  <option value="">Select Agent</option>
                  {
                    Array.isArray(agent) && agent.map((v, k) =>
                      <option key={k} value={v.id}>{v.name}</option>
                    )
                  }
                </select>
              </div>
            </div>
          </div>
        </div>

        <button className="btn" type="submit">Save</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateForm;
