import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../component/AuthContext";
import api from "../component/api";
import "../app.css";

import axios from "axios";
import { useLocation } from "react-router-dom";
const DashboardSearch = () => {
const location = useLocation();
const params = new URLSearchParams(location.search);
const tlname=params.get("tlname");
const agentname=params.get("agentname")
const tl = params.get("tl");
const agent = params.get("agent");
const project = params.get("project");

// console.log(tl, agent, project,tlname,agentname);


  const navigate = useNavigate();
//    const [filters, setFilters] = useState({
//       teamLeaderId: "",
//       agentId: "",
//       projectId: "",
//       //   dateFrom: "",
//       // dateTo: "",
//       // status:""
//     });
  const { user, token } = useAuth();
  const [data, setData] = useState({});
//    const [teamLeaders, setTeamLeaders] = useState([]);
//   const [agents, setAgents] = useState([]);
//     const [projects, setProjects] = useState([]);
//     const [leadSource,setLeadSource]=useState([])
//start search section all data 
 useEffect(() => {
  
    getsearchdata()
      // handleSearch(1);
    // fetchLeads(1);
  }, []);


 
 // useEffect(() => {
  //   fetchDashboardData();
  // }, [user, token]);
const getsearchdata=async(page = 1)=>{
    const payload={
    tl_id:tl||"",
    agent_id:agent||"",   
    project:project||"",

    }
  // console.log("post data",payload)
try {
  const res=await api.post("/get-home-screen-data",payload,{  
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }    
  })
  // console.log("get data",res.data.data)
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
  { title: "Converted", key: "converted", path: "/leads/converted", icon: " 🔄" },
  { title: "Complete Site Visit", key: "completed_site_visit", path: "/leads/completesite", icon: "✅" },
];






  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Sales Dashboard</h2>
        <p>Overview of lead activities</p>
      </div>
{/* Filters */}
     <div className="filter-info">
  <div className="filter-item">
    <span className="filter-label">Team Leader</span>
    <span className="filter-value">{tlname || "Not Select"}</span>
  </div>

  <div className="filter-item">
    <span className="filter-label">Agent</span>
    <span className="filter-value">{agentname || "Not Select"}</span>
  </div>
</div>
     <div className="card-grid">
  {cards.map((card, index) => (
    <div
      key={index}
      className="pro-card"
      onClick={() => navigate(`${card.path}?tl=${tl}&agent=${agent}&project=${project}`)}

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

export default DashboardSearch;
