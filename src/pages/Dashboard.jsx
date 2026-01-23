import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../component/AuthContext";
import api from "../component/api";
import "../app.css";

import {
  FiUserPlus,
  FiRefreshCcw,
  FiClock,
  FiTrendingUp,
  FiPhoneCall,
  FiAlertTriangle,
  FiMapPin,
  FiCalendar,
  FiLayers,
  FiStar,
  FiArchive,
  FiCheckCircle,
} from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [data, setData] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, [user, token]);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get(`/get-home-screen-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status === 200) {
        setData(res.data.data || {});
      }
    } catch (error) {
      console.error(error);
    }
  };

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

     <div className="card-grid">
  {cards.map((card, index) => (
    <div
      key={index}
      className="pro-card"
      onClick={() => navigate(card.path)}
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
