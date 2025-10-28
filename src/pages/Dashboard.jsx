import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../component/AuthContext';
import api from '../component/api';
import '../app.css'; // Custom CSS for styles

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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data.status === 200) {
                setData(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const handleCardClick = (path) => {
        navigate(path);
    };

    const cards = [

        { title: 'New Leads', key: 'new_lead', path: '/leads/new' },
        { title: 'In Process', key: 'in_process', path: '/leads/inprogress' },
        { title: 'Hot Leads', key: 'hot_lead', path: '/leads/hot' },
        { title: 'Today Follow Up', key: 'today_follow_up', path: '/lead/todayfollow' },

        { title: 'Missed Follow Up', key: 'missed_follow_up', path: '/leads/missedfollowup' },


        { title: 'Today Site Visit', key: 'today_site_visit', path: '/lead/TodaySiteVisit' },
        { title: 'Tomorrow Site Visit', key: 'tomorrow_site_visit', path: '/lead/TommorowSiteVisit' },
        { title: 'Scheduled Site Visit', key: "scheduled_site_visit", path: '/lead/scheduledsite' },
        { title: 'Fresh Lead', key: 'fresh_lead', path: '/leads/fresh' },
        { title: 'Archived Lead', key: 'archived_lead', path: '/leads/archived' },
        { title: 'Converted', key: 'converted', path: '/leads/converted' },
        // { title: 'Create Lead', key: null, path: '/leads/create' },
        // { title: 'Table View', key: null, path: '/table' },
    ];
    // console.log(token)
    return (
        <div className="dashboard-container">
            <div className="card-grid">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="card"
                        onClick={() => handleCardClick(card.path)}
                    >
                        <div className="card-title">{card.title}</div>
                        <div className="card-value">{card.key ? data[card.key] || 0 : ''}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
