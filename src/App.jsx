import Login from "./app/auth/Login";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./app/home/Home";
import RegistrationList from "./app/registration/RegistrationList";
import ParticipantList from "./app/participant/ParticipantList";
import JobOfferedList from "./app/jobOffered/JobOfferedList";
import JobRequireList from "./app/jobRequire/JobRequireList";
import DirectoryList from "./app/directory/DirectoryList";
import BusinessOppList from "./app/buisnesOpp/BusinessOppList";
import AmountList from "./app/amount/AmountList";
import LatestNewsList from "./app/latestNews/LatestNewsList";
import CreateNews from "./app/latestNews/CreateNews";
import EditNews from "./app/latestNews/EditNews";
import AmountView from "./app/amount/AmountView";
import BusinessView from "./app/buisnesOpp/BusinessView";
import JobOfferedView from "./app/jobOffered/JobOfferedView";
import JobRequireView from "./app/jobRequire/JobRequireView";
import DirectoryView from "./app/directory/DirectoryView";
import ParticipationList from "./app/participation/ParticipationList";
import CreateParticipation from "./app/participation/CreateParticipation";
import EditParticipation from "./app/participation/EditParticipation";
import JobOfferedEdit from "./app/jobOffered/JobOfferedEdit";
import JobRequireEdit from "./app/jobRequire/JobRequireEdit";
import BusinessEdit from "./app/buisnesOpp/BusinessEdit";
import AmountEdit from "./app/amount/AmountEdit";
import TestView from "./app/participation/TestView";
import ParticipantSummary from "./app/report/participantSummary/ParticipantSummary";

import UserManagementList from "./app/userManagement/UserManagementList";
import CreateManagement from "./app/userManagement/CreateManagement";






const queryClient = new QueryClient()

function App() {
  return (
    <>
       <QueryClientProvider client={queryClient}>
      <Toaster />
      <Routes>
        {/* Login Page        */}
        <Route path="/" element={<Login />} />
        {/* Dashboard  */}
        <Route path="/home" element={<Home />} />
        {/* Registration  */}
        <Route path="/registration" element={<RegistrationList />} />
        {/* id card  */}
        <Route path="/participant" element={<ParticipantList />} />
        {/* participtations */}
        <Route path="/participation" element={<ParticipationList />} />
        <Route path="/create-participants" element={<CreateParticipation />} />
        <Route path="/edit-participants/:id" element={<EditParticipation />} />
        <Route path="/view-participants/:id" element={<TestView />} />
        {/* Job Offered  */}
        <Route path="/job-offered" element={<JobOfferedList />} />
        <Route path="/job-offered-view/:id" element={<JobOfferedView />} />
        <Route path="/job-offered-edit/:id" element={<JobOfferedEdit />} />
        {/* Job Require  */}
        <Route path="/job-require" element={<JobRequireList />} />
        <Route path="/job-require-view/:id" element={<JobRequireView />} />
        <Route path="/job-require-edit/:id" element={<JobRequireEdit />} />
        {/* directory  */}
        <Route path="/directory" element={<DirectoryList />} />
        <Route path="/directory-view/:id" element={<DirectoryView />} />
        {/* Business Opp.  */}
        <Route path="/business-opp" element={<BusinessOppList />} />
        <Route path="/business-opp-view/:id" element={<BusinessView />} />
        <Route path="/business-opp-edit/:id" element={<BusinessEdit />} />
        {/* Amount  */}
        <Route path="/amount" element={<AmountList />} />
        <Route path="/amount-view/:id" element={<AmountView />} />
        <Route path="/amount-edit/:id" element={<AmountEdit />} />
        {/* latest news  */}
        <Route path="/latest-news" element={<LatestNewsList />} />
        <Route path="/create-news" element={<CreateNews />} />
        <Route path="/edit-news/:id" element={<EditNews />} />
        {/* report  */}
        <Route path="/participant-summary" element={<ParticipantSummary />} />
        <Route path="/user-management" element={<UserManagementList />} />
        <Route path="/create-user-management" element={<CreateManagement />} />
        
      </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
