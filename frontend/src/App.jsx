
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginTeacher from './components/LoginTeacher';
import LoginStudent from './components/LoginStudent';
import TeacherDashboard from './components/TeacherDashboard';
import StudentView from './components/StudentView';
import SignupTeacher from './components/SignupTeacher';
import SignupStudent from './components/SignupStudent';
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/resetPassword";
import ResultPage from './utils/ResultPage';
import ResultManager from './utils/ResultManager';
import StudentShow from './pages/StudentShow';
import TeacherPanel from './pages/TeacherPanel';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityForm from './pages/ActivityForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-teacher" element={<LoginTeacher />} />
        <Route path="/login-student" element={<LoginStudent />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-view" element={<StudentView />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/reset-password/:token" element={<ResetPassword />} />

<Route path="/signup-teacher" element={<SignupTeacher />} />
<Route path="/signup-student" element={<SignupStudent />} />
<Route path="/result" element={<ResultPage />} />
<Route path="/resultManager" element={<ResultManager />} />
<Route path="/student" element={<StudentShow />} />
<Route path="/teacher/panel" element={<TeacherPanel />} />
<Route path="/act" element={<ActivitiesPage />} />
<Route path="/actform" element={<ActivityForm/>} />

      </Routes>
    </Router>
  );
}

export default App;
