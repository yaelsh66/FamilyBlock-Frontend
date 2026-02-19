
import ParentHomePage from './pages/homePage/ParentHomePage.jsx';
import PublicHomePage from './pages/homePage/PublicHomePage.jsx';
import Navbar from './templates/Navbar.jsx'
import Login from './components/Login.jsx';
import { Routes, Route, Outlet } from 'react-router-dom';
import SignupFamily from './pages/forms/SignupFamily.jsx';
import AddTaskForm from './pages/forms/AddTaskForm.jsx';
import TasksPage from './pages/TasksPage.jsx';
import ChildHomePage from './pages/homePage/ChildHomePage.jsx';
import ChildTasksPage from './pages/ChildTasksPage.jsx';
import Brawl from './components/Brawl.jsx';
import BackgroundWrapper from './templates/BackgroundWrapper.jsx';
import WeeklyTable from './components/WeeklyTable.jsx';
import ParentControl from './pages/ParentControl.jsx';
import ParentApprovalPage from './pages/ParentApprovalPage.jsx';
import Profile from './pages/Profile.jsx';
import Device from './pages/Device.jsx';
import TaskHistoryPage from './pages/TaskHistoryPage.jsx';
function AppLayout() {
  return (
    <>
      <Navbar />
      <div className="app-container">
        <BackgroundWrapper>
          <Outlet />
        </BackgroundWrapper>
      </div>
    </>
  );
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<PublicHomePage />} />
        <Route element={<AppLayout />}>
          <Route path='/week' element={<WeeklyTable />} />
          <Route path="/parent" element={<ParentHomePage />} />
          <Route path="/child" element={<ChildHomePage />} />
          <Route path="/child/tasks" element={<ChildTasksPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupFamily />} />
          <Route path="/newtask" element={<AddTaskForm />} />
          <Route path="/tasksList" element={<TasksPage />} />
          <Route path="/brawl" element={<Brawl />} />
          <Route path="/parent/controll" element={<ParentControl />} />
          <Route path="/parent/approval" element={<ParentApprovalPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/device/:childId" element={<Device />} />
          <Route path="/parent/history" element={<TaskHistoryPage />} />
          <Route path="/child/history" element={<TaskHistoryPage />} />
        </Route>
      </Routes>
    </div>
  );
}


export default App;
