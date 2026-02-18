import React, { useState, useEffect } from "react";
import api from "../../component/api";
import axios from "axios";
import Example from "./Example";
import "../../app.css";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../component/AuthContext";

const FreshLead = () => {
   const [searchParams] = useSearchParams();
  const { user } = useAuth()
  const [data, setData] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search,setSearch]=useState("")
  const [filters, setFilters] = useState({
    teamLeaderId: "",
    agentId: "",
    projectId: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const tl = searchParams.get("tl");
const agent = searchParams.get("agent");
const project = searchParams.get("project");
// console.log("test",search)
  const rowsPerPage = 50;

  useEffect(() => {
    fetchTeamLeaders();
    fetchProjects();
    fetchLeads(1);
  }, []);

  const fetchTeamLeaders = async () => {
    try {
      const res = await axios.get("https://api.almonkdigital.in/api/admin/get-team-leader", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setTeamLeaders(res.data.data);
    } catch (err) {
      console.error("Team Leader fetch error:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get("https://api.almonkdigital.in/api/admin/view-master-setting", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const projectList = res.data.data.filter(item => item.cat_name === "Project");
      setProjects(projectList);
    } catch (err) {
      console.error("Project fetch error:", err);
    }
  };

  const handleTeamLeaderChange = async (e) => {
    const id = e.target.value;
    setFilters(prev => ({ ...prev, teamLeaderId: id }));
    try {
      const res = await axios.get(`https://api.almonkdigital.in/api/admin/get-agent/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setAgents(res.data.data);
    } catch (err) {
      console.error("Agent fetch error:", err);
    }
  };

  const handleAgentChange = (e) => {
    setFilters(prev => ({ ...prev, agentId: e.target.value }));
  };

  const handleProjectChange = (e) => {
    setFilters(prev => ({ ...prev, projectId: e.target.value }));
  };

// search data by project 
  const handleSearch  = (e) => {
    setSearch( e.target.value);
  };
 const getsearchdata = async (page = 1) => {
    try {
      const payload = {
        // lead_status: "0",
        page,
       project:search
      };
console.log(payload)
      const res = await api.post("/fresh-lead-filter", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const list = res?.data?.data || [];
      const meta = res?.data?.meta;

      const mapped = list.map((item, index) => ({
        serialNO: (page - 1) * rowsPerPage + index + 1,
        id: item.id,
        customerId: item.cust_id,
        enterDate: moment(item.created_at).utcOffset('+05:30').format('DD/MM/YYYY, hh:mm A'),
        contactPerson: item.name,
        contactNumber: item.contact,
        city: item.city,
        leadSource: item.lead_source,
        project: item.form_name,
      }));

      setData(mapped);
      setCurrentPage(meta?.current_page || 1);
      setTotalPages(meta?.last_page || 1);
    } catch (err) {
      console.error("Lead fetch error:", err);
    }
  };
//End search data by project 
  const fetchLeads = async (page = 1) => {
    try {
      const payload = {
        lead_status: "0",
        page,
       tl_id:tl,agent_id:agent,project:project
      };

      const res = await api.post("/get-lead-data", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const list = res?.data?.data || [];
      const meta = res?.data?.meta;

      const mapped = list.map((item, index) => ({
        serialNO: (page - 1) * rowsPerPage + index + 1,
        id: item.id,
        customerId: item.cust_id,
        enterDate: moment(item.created_at).utcOffset('+05:30').format('DD/MM/YYYY, hh:mm A'),
        contactPerson: item.name,
        contactNumber: item.contact,
        city: item.city,
        leadSource: item.lead_source,
        project: item.form_name,
      }));

      setData(mapped);
      setCurrentPage(meta?.current_page || 1);
      setTotalPages(meta?.last_page || 1);
    } catch (err) {
      console.error("Lead fetch error:", err);
    }
  };

  const handleTransfer = async () => {
    if (!filters.teamLeaderId) return alert("Please select a Team Leader first.");
    const payload = {
      lead_id: selectedLeads,
      tl_id: filters.teamLeaderId,
      agent_id: filters.agentId,
      project_id: filters.projectId,
      user_id: user.user_id
    };
    // console.log("check", payload)
    try {
      const res = await api.post("/assign-lead", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      // console.log(res)
      if (res?.status === 200) {
        alert("Leads transferred!");
        setSelectedLeads([]);
        fetchLeads(currentPage);
      } else {
        alert("Transfer failed.");
      }
    } catch (err) {
      console.error("Transfer error:", err);
      alert("Something went wrong.");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) fetchLeads(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const columns = [
    {
      field: "select",
      headerName: (
        <input
          type="checkbox"
          checked={data.length && selectedLeads.length === data.length}
          onChange={(e) =>
            setSelectedLeads(e.target.checked ? data.map(row => row.id) : [])
          }
        />
      ),
      renderCell: (row) => (
        <input
          type="checkbox"
          checked={selectedLeads.includes(row.id)}
          onChange={(e) => {
            setSelectedLeads(prev =>
              e.target.checked ? [...prev, row.id] : prev.filter(id => id !== row.id)
            );
          }}
        />
      )
    },
    { field: "serialNO", headerName: "#" },
    { field: "enterDate", headerName: "Entry Date" },
    { field: "contactPerson", headerName: "Contact Person" },
    { field: "city", headerName: "City" },
    { field: "contactNumber", headerName: "Contact Number" },
    { field: "leadSource", headerName: "Lead Source" },
    { field: "project", headerName: "Project" }
  ];
  // console.log(user)

  return (

    <div >
      <h2 className="mb-2 text-center textsize headingstyle">Fresh Leads</h2>
    <form>
      <div style={{ background: "#eee", padding: 15, borderRadius: 6, marginBottom: 15, display: "flex", justifyContent: "space-between" }}>
        <div style={{display:"flex",gap:10}}>
          <select onChange={handleSearch} value={search}>
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.cat_value} value={p.cat_value}>{p.cat_value}</option>
          ))}
        </select>
          <button type="button" className="search-btn" onClick={() => getsearchdata(1)}>Search</button>
      </div>
<div style={{display:"flex",gap:10, alignItems: "center"}}>
  <p className="mb-0" style={{fontSize:12}}>Assign To</p>
        <select onChange={handleTeamLeaderChange} value={filters.teamLeaderId}>
          <option value="">Select Team Leader</option>
          {teamLeaders.map(tl => (
            <option key={tl.user_id} value={tl.user_id}>{tl.name}</option>
          ))}
        </select>

        <select onChange={handleAgentChange} value={filters.agentId}>
          <option value="">Select Agent</option>
          {agents.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <select onChange={handleProjectChange} value={filters.projectId}>
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.cat_value} value={p.cat_value}>{p.cat_value}</option>
          ))}
        </select>

        {selectedLeads.length > 0 && (
          <button onClick={handleTransfer} style={{ padding: "5px 10px", borderRadius: 5, background: "#28a745", color: "#fff" }}>
            Transfer Selected Leads
          </button>
        )}
        </div>
      </div>

      <Example data={data} columns={columns} rowsPerPageOptions={[rowsPerPage]} />

      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>Prev</button>
        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{ backgroundColor: page === currentPage ? "#f00" : "#003961", color: "#fff", padding: "6px 12px" }}
          >
            {page}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Next</button>
      </div>
      </form>
    </div>
  );
};

export default FreshLead;