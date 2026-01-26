import React, { useState, useEffect } from "react";
import Example from "./Example";
import api from "../../component/api";
import moment from "moment";
import axios from "axios";
import { useAuth } from "../../component/AuthContext";
const LeadTransfer = () => {
   const { user } = useAuth()
    const [selectedLeads, setSelectedLeads] = useState([]);
const [filters, setFilters] = useState({
    teamLeaderId: "",
    agentId: "",
    projectId: "",
      dateFrom: "",
    dateTo: "",
    status:""
  });
  // 🔁 Transfer filters
const [transferFilters, setTransferFilters] = useState({
  teamLeaderId: "",
  agentId: "",
  transferstatus:""
});
  const [data, setData] = useState([]);
const [agentstransfer,setAgentstransfer]=useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [totalRecords, setTotalRecords] = useState(0);
   const [teamLeaders, setTeamLeaders] = useState([]);
    const [teamLeadertransfer, setTeamLeadertransfer] = useState([]);
  const [agents, setAgents] = useState([]);
    const [projects, setProjects] = useState([]);
  const rowsPerPage = 50;

//start search section all data 
 useEffect(() => {
    fetchTeamLeaders();
    fetchProjects();
    
  }, []);
const fetchTeamLeaders = async () => {
    try {
      const res = await axios.get("https://api.almonkdigital.in/api/admin/get-team-leader", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setTeamLeaders(res.data.data);
      
      console.log(res.data.data)
    } catch (err) {
      console.error("Team Leader fetch error:", err);
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
        // console.log(res.data.data)
    } catch (err) {
      console.error("Agent fetch error:", err);
    }
  };
 
  
 const fetchProjects = async () => {
    try {
      const res = await axios.get("https://api.almonkdigital.in/api/admin/view-master-setting", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
     
      const projectList = res.data.data.filter(item => item.cat_name === "Project");

      setProjects(projectList);
      //  const leadsource = res.data.data.filter(item => item.cat_name === "Lead Source");
      //  setLeadSource(leadsource)

    } catch (err) {
      console.error("Project fetch error:", err);
    }
  };
 const handleAgentChange = (e) => {
    setFilters(prev => ({ ...prev, agentId: e.target.value }));
  };
 
  const handleProjectChange = (e) => {
    setFilters(prev => ({ ...prev, projectId: e.target.value }));
  };
const handleStatus = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
  };
const getsearchdata=async(page = 1)=>{
  if (!filters.teamLeaderId) return alert("Please select a Team Leader first.");

    const payload={
    tl_id:filters.teamLeaderId,
    agent_id:filters.agentId,
    lead_status:filters.status,
    project:filters.projectId,
    from_date:filters.dateFrom,
    to_date:filters.dateTo
    }
  // console.log("post data",payload)
try {
  const res=await axios.post("https://api.almonkdigital.in/api/admin/search-agent-data",payload,{  
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }    
  })
  // console.log("search data",res.data.data)
 const result = res?.data?.data;
      // console.log(result)
      if (res.status === 200 && Array.isArray(result)) {
        const mapped = result.map((item, index) => ({
          id: (page - 1) * rowsPerPage + index + 1,
          customerId: item.id,
          enterDate: moment(item.created_at).utcOffset("+05:30").format("DD/MM/YYYY, hh:mm A"),
          contactPerson: item.name,
          contactNumber: item.contact,
          leadSource: item.lead_source,
          city: item.city,
          Agentassign: moment(item.assign_time).utcOffset("+05:30").format("DD/MM/YYYY, hh:mm A"),
          teamLeader: item.team_leader,
          agent: item.agent,
          leadstatus: item.lead_status,
          project: item.form_name,
          followUp: item.follow_ups,
          archivedReason: item.archived_reason,
          lastUpdate: moment(item.updated_at).utcOffset("+05:30").format("DD/MM/YYYY, hh:mm A"),
          observation: item.remark,
        }));

        setData(mapped);
        setCurrentPage(res.data.meta?.current_page || 1);
        setTotalPages(res.data.meta?.last_page || 1);
        // setTotalRecords(res.data.meta?.total || 0);
      } else {
        setData([]);
      }
  
} catch (error) {
  console.log(error)
}
}
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }))
  };

// end search data section 



// fransfer lead  section

const handleTransferTLChange = async (e) => {
    const id = e.target.value;
    setTransferFilters(prev => ({ ...prev, teamLeaderId: id }));
    try {
      const res = await axios.get(`https://api.almonkdigital.in/api/admin/get-agent/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setAgentstransfer(res.data.data);
        // console.log(res.data.data)
    } catch (err) {
      console.error("Agent fetch error:", err);
    }
  };
 
const handleTransferAgentChange = (e) => {
  setTransferFilters(prev => ({ ...prev, agentId: e.target.value }));
};

const handleTransferStatus = (e) => {
    setTransferFilters(prev => ({ ...prev, transferstatus: e.target.value }));
  };


   const handleTransfer = async () => {
    if (!transferFilters.teamLeaderId) return alert("Please select a Team Leader first.");
 const payload = {
  lead_id: selectedLeads,
  to_tl_id: transferFilters.teamLeaderId,
  to_agent_id: transferFilters.agentId,
  lead_status:transferFilters.transferstatus,
  user_id: user.user_id,
};

    console.log("check", payload)
    // try {
    //   const res = await api.post("/transfer-agent-lead", payload, {
    //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    //   });
    //   // console.log(res)
    //   if (res?.status === 200) {
    //     alert("Leads transferred!");
    //     setSelectedLeads([]);
    //     fetchLeads(currentPage);
    //   } else {
    //     alert("Transfer failed.");
    //   }
    // } catch (err) {
    //   console.error("Transfer error:", err);
    //   alert("Something went wrong.");
    // }
  };
  // fransfer lead  section end
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
    { field: "id", headerName: "#", align: "center" },
    { field: "enterDate", headerName: "Entry Date", align: "center" },
    {
      field: "contactPerson",
      headerName: "Contact Person",
      align: "left",
      renderCell: (row) => (
        <a
          href={`/lead-update/${row.customerId}`}
          style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}
        >
          {row.contactPerson}
        </a>
      ),
    },
    { field: "city", headerName: "City" },
    { field: "contactNumber", headerName: "Contact Number", align: "center" },
    { field: "leadSource", headerName: "Lead Source", align: "left" },
    { field: "Agentassign", headerName: "Agent Assignment", align: "left" },
    { field: "teamLeader", headerName: "Team Leader", align: "left" },
    { field: "agent", headerName: "Agent", align: "left" },
    { field: "project", headerName: "Project", align: "left" },
    { field: "followUp", headerName: "Follow Up", align: "center" },
    { field: "archivedReason", headerName: "Archived Reason", align: "left" },
    { field: "lastUpdate", headerName: "Last Update", align: "center" },
    { field: "leadstatus", headerName: "Lead Status", align: "center" },
    { field: "observation", headerName: "Observation", align: "left" },
  ];
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) fetchLeads(page);
  };
  function getPageNumbers(currentPage, totalPages) {
    const pageNumbers = [];

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }
console.log("leader",teamLeadertransfer)
  return (
    <div>
      <h2 className="mb-2 text-center textsize headingstyle">Lead Transfer </h2>
      {/* Filter Section */}
      <div style={{ padding: "20px", background: "#eaeaea", borderRadius: "6px", marginBottom: "20px" }}>
        <form style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
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

    
  <select onChange={handleStatus} >
          <option value="">Select Leads Status</option>
          <option  value="1">New Lead</option>
            <option  value="11">Reassign Leads</option>
            <option  value="2">In Progress Leads</option>
            <option  value="3">Hot Leads</option>
            <option  value="0">Fresh Leads</option>
            <option  value="4">Archived Leads</option>
            <option  value="5">Converted Leads</option>
        </select>
          <select onChange={handleProjectChange} value={filters.projectId}>
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.cat_value} value={p.cat_value}>{p.cat_value}</option>
          ))}
        </select>

    

          <input name="dateFrom" type="date" placeholder="From" value={filters.dateFrom} onChange={handleFilterChange} />
          <input name="dateTo" type="date" placeholder="To"  value={filters.dateTo} onChange={handleFilterChange} />

     

          <button type="button" onClick={() => getsearchdata(1)}>Search</button>
        </form>
      </div>

      {/* Table Section */}
      <Example data={data} columns={columns} rowsPerPageOptions={[50]} />

      {/* Enhanced Pagination Section */}
      <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
        {/* Prev Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          style={{ padding: "8px 16px", backgroundColor: currentPage <= 1 ? "#e0e0e0" : "#003961", color: currentPage <= 1 ? "#888" : "#ffffff", border: "none", borderRadius: "6px", cursor: currentPage <= 1 ? "not-allowed" : "pointer" }}
        >
          Prev
        </button>

        {/* Numbered Pages */}
        {getPageNumbers(currentPage, totalPages).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{ padding: "6px 12px", backgroundColor: page === currentPage ? "#ff0000" : "#003961", color: "#ffffff", border: "none", borderRadius: "6px" }}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={{ padding: "8px 16px", backgroundColor: currentPage >= totalPages ? "#e0e0e0" : "#003961", color: currentPage >= totalPages ? "#888" : "#ffffff", border: "none", borderRadius: "6px", cursor: currentPage >= totalPages ? "not-allowed" : "pointer" }}
        >
          Next
        </button>
      </div>

<div style={{ padding: "20px", background: "#eaeaea", borderRadius: "6px", marginBottom: "20px" }}>
        <form style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
       <select value={transferFilters.teamLeaderId} onChange={handleTransferTLChange}>

          <option value="">Select Team Leader</option>
          {teamLeaders.map(tl => (
            <option key={tl.user_id} value={tl.user_id}>{tl.name}</option>
          ))}
        </select>

          <select onChange={handleTransferAgentChange} value={transferFilters.agentId}>
          <option value="">Select Agent</option>
          {agentstransfer.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

    
  <select onChange={handleTransferStatus} >
          <option value="">Select Leads Status</option>
          <option  value="1">New Lead</option>
            <option  value="11">Reassign Leads</option>
            <option  value="2">In Progress Leads</option>
            <option  value="3">Hot Leads</option>
            <option  value="0">Fresh Leads</option>
            <option  value="4">Archived Leads</option>
            <option  value="5">Converted Leads</option>
        </select>


         {selectedLeads.length > 0 && (
          <p onClick={handleTransfer} style={{ padding: "5px 10px", borderRadius: 5, background: "#28a745", color: "#fff" }}>
            Transfer Selected Leads
          </p>
        )}
</form>
</div>
    </div>
  )
};

export default LeadTransfer;
