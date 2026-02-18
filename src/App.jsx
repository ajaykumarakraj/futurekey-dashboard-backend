import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MiniDrawer from './comman/MiniDrawer';

import WalkUpload from './pages/WalkUpload';
import CustomTable from './pages/Table/customtable';
import ChangePassword from './pages/ChangePassword';
import ContactSupport from './pages/ContactSupport';
import Dashboard from './pages/Dashboard';
import SignInPage from './pages/SignInPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import UserForm from './pages/UserForm';
import UserMangementTable from './pages/Table/UserMangementTable';
import UpdateUserForm from './pages/UpdateUserForm';
import MasterSetting from './pages/MasterSetting';
import CreateForm from './pages/CreateForm';
import FreshLead from './pages/Table/FreshLead';

import ProtectedRoute from './component/ProtectedRoute'; // import this
import NewLead from './pages/Table/NewLead';
import InProgressLead from './pages/Table/InProgressLead';
import HotLead from './pages/Table/HotLead';
import ArchivedLead from './pages/Table/ArchivedLead';
import ConvertedLead from './pages/Table/ConvertedLead';
import MissedFollowLead from './pages/Table/MissedFollowLead';
import ScheduledSiteLead from './pages/Table/ScheduledSiteLead';
import TodayFollow from './pages/Table/TodayFollow';
import TodaySiteVisit from './pages/Table/TodaySiteVisit';
import TommorowSiteVisit from './pages/Table/TommorowSiteVisit';
import UpdateLeadForm from './pages/UpdateLeadForm';
import ConnectForm from './pages/ConnectForm';
import Reassign from './pages/Table/Reassign';
import LeadTransfer from './pages/Table/LeadTransfer';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/verifyOtp" element={<VerifyOtpPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MiniDrawer />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads/fresh" element={<FreshLead />} />
          <Route path="/leads/lead-transfer" element={<LeadTransfer />} />
        <Route path="/leads/new" element={<NewLead />} />
        <Route path='/leads/inprogress' element={<InProgressLead />} />
        <Route path='/leads/hot' element={<HotLead />} />
        <Route path='/leads/archived' element={<ArchivedLead />} />
        <Route path='/leads/converted' element={<ConvertedLead />} />
        <Route path='leads/missedfollowup' element={<MissedFollowLead />} />
        <Route path='/lead/scheduledsite' element={<ScheduledSiteLead />} />
        <Route path='/lead/todayfollow' element={<TodayFollow />} />
        <Route path='/lead/todaysitevisit' element={<TodaySiteVisit />} />
        <Route path='/lead/TommorowSiteVisit' element={<TommorowSiteVisit />} />
        <Route path="/leads/create" element={<CreateForm />} />
        <Route path="/leads/reassign" element={<Reassign/>}/>
        <Route path="/leads/bulk-upload" element={<WalkUpload />} />
        <Route path="/leads/table" element={<CustomTable />} />
        <Route path="/user/table" element={<UserMangementTable />} />
        <Route path="/user/form" element={<UserForm />} />
        <Route path="/user/update/:id" element={<UpdateUserForm />} />
        <Route path="/lead-update/:id" element={<UpdateLeadForm />} />
        <Route path="/table" element={<CustomTable />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/support" element={<ContactSupport />} />
        <Route path="/mastersetting" element={<MasterSetting />} />
        <Route path='/connect-form' element={<ConnectForm />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
