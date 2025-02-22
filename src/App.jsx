import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
// Import Sidebar
import LandingPage from "./LandingPage";
import Login from "./components/Login";
import NewUserSignup from "./components/NewUserSignup";
import PortalAdminSignup from "./components/PortalAdminSignup";
import ForgotPassword from "./components/ForgotPassword";
import AddModifyModule from "./components/PortalAdmin/AddModifyModule";
import AddInstitute from "./components/PortalAdmin/AddInstitute";
import ModifyInstitute from "./components/PortalAdmin/ModifyInstitute";
import DeleteIstitute from "./components/PortalAdmin/DeleteIstitute";
import AddModule from "./components/PortalAdmin/AddModule";
import RoleBasedAccessControl from "./components/PortalAdmin/RoleBasedAccessControl";
import PortalParameterConfig from "./components/PortalAdmin/PortalParameterConfig";
import Portaladmin from "./components/Portaladmin"; // Import PortalAdmin
import "./styles/index.css";
import DeleteModule from "./components/PortalAdmin/DeleteModule";
import AddStream from "./components/PortalAdmin/AddStream";
import AddCentre from "./components/PortalAdmin/AddCenter";
import ViewStream from "./components/PortalAdmin/ViewStream";
import ViewInstitutes from "./components/PortalAdmin/InstitueAdmin/ViewInstitutes";
import ViewMappedModules from "./components/PortalAdmin/InstitueAdmin/ViewMappedModules";
import ViewCentre from "./components/PortalAdmin/ViewCentre";
import ViewSubject from "./components/InstituteAdminDashboard/ViewSubject";
import ViewSyllabus from "./components/InstituteAdminDashboard/ViewSyllabus";
import ModifySubject from "./components/InstituteAdminDashboard/ModifySubject";
import AddSyllabus from "./components/InstituteAdminDashboard/AddSyllabus";
import ViewMappedUsers from "./components/PortalAdmin/InstitueAdmin/ViewMappedUsers";
import InstituteAdmin1 from "./components/InstituteAdminDashboard/InstituteAdmin1";
import MapUserToModule from "./components/InstituteAdminDashboard/MapUserToModule";
import ViewSubscriptionAndBillingDetails from "./components/InstituteAdminDashboard/ViewSubscriptionAndBillingDetails";
import ViewMappedModulesInstitute from "./components/InstituteAdminDashboard/ViewMappingDetailsInstitute";
import DeleteMappedUser from "./components/InstituteAdminDashboard/DeleteMappedUser";
import AddSubject from "./components/InstituteAdminDashboard/AddSubject";
import ModifySyllabus from "./components/InstituteAdminDashboard/ModifySyllabus";
import Examiner from "./components/Examiner/Examnier1";
import AddTest from "./components/Examiner/AddTest";
import UpdateTest from "./components/Examiner/UpdateTest";
import ModifyTest from "./components/Examiner/ModifyTest";
import DeleteTest from "./components/Examiner/DeleteTest";
import UpdateTestQ from "./components/Examiner/UpdateTestQ&A";
import Question from "./components/Examiner/Question";
import UpdateTestAnswer from "./components/Examiner/UpdateTestAnswer";
import Answers from "./components/Examiner/Answers";
import ModifyStream from "./components/PortalAdmin/ModifyStream";
import UpdateAnswer from "./components/Examiner/UpdateAnswer";
import UpdateQuestionBank from "./components/Examiner/UpdateQuestionForQBank";
import SetQuestionManual from "./components/Examiner/SetQuestionManual";
import ManualEntry from "./components/Examiner/ManualEntry";
import SetQuestionAutomated from "./components/Examiner/SetQuestionAutomated";
import AutomatedQuestionSelection from "./components/Examiner/AutomatedQuestionSelection";

import ChiefExaminer from "./components/ChiefExaminer/ChiefExaminer";
import AddTest1 from "./components/ChiefExaminer/AddTest";
import SetQuestionManual1 from "./components/ChiefExaminer/SetQuesionManual1";
import ScheduleForm from "./components/Examiner/ScheduleForm";


import ScheduleTest from "./components/Examiner/ScheduleTest";

import Student from "./components/Student/Student";
import UpcomingTest from "./components/Student/UpcomingTest";
import LiveTest from "./components/Student/LiveTest";
import ExpiredTest from "./components/Student/ExpiredTest";
import AppearTest from "./components/Student/AppearTest";
import TestPage from "./components/Student/TestPage";
const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar /> {/* Navbar will always be displayed */}
        {/* Render Sidebar only on the /portal-admin route */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<NewUserSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Wrap /portal-admin route with Sidebar and content */}
          <Route
            path="/portaladmin"
            element={
              <div className="portal-admin-container">
                {/* Sidebar will always show on /portal-admin */}
                <div className="content-container">
                  <Portaladmin /> {/* PortalAdmin page content */}
                </div>
              </div>
            }
          />

          {/* Other routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/portal-admin-signup3321" element={<PortalAdminSignup />} />
          <Route path="/add-institute" element={<AddInstitute />} />
          <Route path="/modify-institute" element={<ModifyInstitute />} />
          <Route path="/delete-institute" element={<DeleteIstitute />} />
          <Route path="/add-module" element={<AddModule />} />
          <Route path="/add-modify-module" element={<AddModifyModule />} />
          <Route path="/delete-module" element={<DeleteModule />} />
          <Route path="/add-stream" element={<AddStream />} />
          <Route path="/view-stream" element={<ViewStream />} />
          <Route path="/view-stream" element={<ViewStream />} />
          <Route path="/view-syllabus" element={<ViewSyllabus />} />
          <Route path="/modify-stream" element={<ModifyStream />} />
          <Route path="/modify-subject" element={<ModifySubject />} />
          <Route path="/modify-syllabus" element={<ModifySyllabus />} />
          <Route path="/add-centre" element={<AddCentre />} />
          <Route
            path="/role-access-control"
            element={<RoleBasedAccessControl />}
          />
          <Route
            path="/portal-parameter-config"
            element={<PortalParameterConfig />}
          />
          <Route path="/view-institue" element={<ViewInstitutes />} />
          <Route path="/view-mapped-modules" element={<ViewMappedModules />} />
          <Route path="/view-mapped-users" element={<ViewMappedUsers />} />
          <Route
            path="/institue-admin-dashboard"
            element={<InstituteAdmin1 />}
          />
          <Route path="/map-users-to-modules" element={<MapUserToModule />} />
          <Route
            path="/view-subscription"
            element={<ViewSubscriptionAndBillingDetails />}
          />
          <Route
            path="/view-modulesdetails"
            element={<ViewMappedModulesInstitute />}
          />
          <Route path="/add-subject" element={<AddSubject />} />
          <Route path="/add-syllabus" element={<AddSyllabus />} />
          <Route path="/view-subject" element={<ViewSubject />} />
          <Route path="/delete-mapped-user" element={<DeleteMappedUser />} />
          <Route path="/examiner-dashboard" element={<Examiner />} />
          <Route path="/add-test" element={<AddTest />} />
          <Route path="/update-test" element={<UpdateTest />} />
          <Route path="/modify-test" element={<ModifyTest />} />
          <Route path="/delete-test" element={<DeleteTest />} />
          <Route path="/update-q&a" element={<UpdateTestQ />} />
          <Route path="/update-q" element={<UpdateQuestionBank />} />
          <Route path="/update-ans" element={<UpdateTestAnswer />} />
          <Route path="/questions" element={<Question />} />
          <Route path="/add-answers" element={<UpdateAnswer />} />
          <Route path="/answers" element={<Answers />} />
          <Route path="/manual-entry" element={<ManualEntry />} />
          <Route path="/set-questions-manual" element={<SetQuestionManual />} />
          <Route path="/set-questions-automated" element={<SetQuestionAutomated />} />
          <Route path="/automate-entry" element={<AutomatedQuestionSelection />} />
          <Route path="/schedule" element={<ScheduleTest />} />
          <Route path="/schedule-form" element={<ScheduleForm />} />
        


          <Route path="/add-test" element={<AddTest1 />} />


          <Route path="/chief-examiner" element={<ChiefExaminer />} />
          <Route path="/set-questions-manual1" element={<SetQuestionManual1 />} />
          


          <Route path="/student-dashboard" element={<Student />} />
          <Route path="/upcoming-test" element={<UpcomingTest />} />
          <Route path="/live-test" element={<LiveTest />} />
          <Route path="/expire-test" element={<ExpiredTest />} />
          <Route path="/attempted-test" element={<UpcomingTest />} />
          <Route path="/appear-test" element={<AppearTest />} />
          <Route path="/test-page" element={<TestPage />} />


        </Routes>
      </div>
    </Router>
  );
};

export default App;
