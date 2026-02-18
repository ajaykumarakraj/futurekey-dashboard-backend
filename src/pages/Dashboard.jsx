import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../component/AuthContext";
import api from "../component/api";
import "../app.css";

import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
   const [filters, setFilters] = useState({
      teamLeaderId: "",
      agentId: "",
      projectId: "",
      //   dateFrom: "",
      // dateTo: "",
      // status:""
    });
  const { user, token } = useAuth();
  const [data, setData] = useState({});
   const [teamLeaders, setTeamLeaders] = useState([]);
  const [agents, setAgents] = useState([]);
    const [projects, setProjects] = useState([]);
    const [leadSource,setLeadSource]=useState([])
//start search section all data 
 useEffect(() => {
    fetchTeamLeaders();
    fetchProjects();
    getsearchdata()
      // handleSearch(1);
    // fetchLeads(1);
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
        console.log(res.data.data)
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
       const leadsource = res.data.data.filter(item => item.cat_name === "Lead Source");
       setLeadSource(leadsource)

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
 // useEffect(() => {
  //   fetchDashboardData();
  // }, [user, token]);
const getsearchdata=async(page = 1)=>{
    const payload={
    tl_id:filters.teamLeaderId||"",
    agent_id:filters.agentId||"",   
    project:filters.projectId||"",

    }
  console.log("post data",payload)
try {
  const res=await axios.post("https://api.almonkdigital.in/api/admin/get-home-screen-data",payload,{  
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }    
  })
  console.log("get data",res.data.data)
 setData(res.data.data || {});
     
  
} catch (error) {
  console.log(error)
}
}
// end search data section 


const cards = [
  { title: "New Leads", key: "new_lead", path: "/leads/new", icon: "👥" },
  { title: "Reassign Lead", key: "reassign_lead", path: "/leads/reassign", icon: "🔁" },
  { title: "In Process", key: "in_process", path: "/leads/inprogress", icon: "⏳" },
  { title: "Hot Leads", key: "hot_lead", path: "/leads/hot", icon: "🔥" },
  { title: "Today Follow Up", key: "today_follow_up", path: "/lead/todayfollow", icon: "📞" },
  { title: "Missed Follow Up", key: "missed_follow_up", path: "/leads/missedfollowup", icon: "⚠️" },
  { title: "Today Site Visit", key: "today_site_visit", path: "/lead/TodaySiteVisit", icon: "📍" },
  { title: "Tomorrow Site Visit", key: "tomorrow_site_visit", path: "/lead/TommorowSiteVisit", icon: "🗓️" },
  { title: "Scheduled Site Visit", key: "scheduled_site_visit", path: "/lead/scheduledsite", icon: "📆" },
  { title: "Fresh Lead", key: "fresh_lead", path: "/leads/fresh", icon: "✨" },
  { title: "Archived Lead", key: "archived_lead", path: "/leads/archived", icon: "🗄️" },
  { title: "Converted", key: "converted", path: "/leads/converted", icon: "✅" },
];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Sales Dashboard</h2>
        <p>Overview of lead activities</p>
      </div>
{/* Filters */}
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

          {/* <select name="leadSource" value={filters.leadSource} onChange={handleFilterChange}>
            <option value="">Lead Source</option>
     {leadSource.map(p => (
            <option key={p.cat_value} value={p.cat_value}>{p.cat_value}</option>
          ))}
          </select> */}
 
          <select onChange={handleProjectChange} value={filters.projectId}>
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.cat_value} value={p.cat_value}>{p.cat_value}</option>
          ))}
        </select>



          <button type="button" onClick={() => getsearchdata(1)}>Search</button>
        </form>
      </div>
     <div className="card-grid">
  {cards.map((card, index) => (
    <div
      key={index}
      className="pro-card"
      onClick={() => navigate(`${card.path}?tl=${filters.teamLeaderId}&agent=${filters.agentId}&project=${filters.projectId}`)}

    >
      <div className="emoji-icon">
        {card.icon}
      </div>

      <div className="card-info">
        <span>{card.title}</span>
        <h3>{data[card.key] ?? 0}</h3>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default Dashboard;
