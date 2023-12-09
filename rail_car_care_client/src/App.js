import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ManagerHome from './components/ManagerHome'; 
import './App.css';
import ComplaintPageTravelers from './components/ComplaintPageTravelers';
import PasswordResetRequest from './components/PasswordReset';
import ProfilePage from './components/Profile';
import Orders from './components/Orders';
import Complaints from './components/Complaints';
import Assignments from './components/Assignments';
import EmployeePage from './components/EmployeeForm';
import UriContext from './UriContext';


function App() {
  const uriValue = 'https://express-backend-mjycvennua-uc.a.run.app';
  const navigateToLogin = () => {
    window.location.href = '/';
  };

  return (
    <div className="App">
      <UriContext.Provider value={uriValue}>
      <Router>
        <Routes>
          <Route path='/' element={<ComplaintPageTravelers/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp onSignupSuccess={navigateToLogin} />} />
          <Route path="/home" element={<ManagerHome />} />
          <Route path='/profile' element={<ProfilePage/> }/>
          <Route path='/orders' element={<Orders/>} />
          <Route path="/complaints" element={<Complaints/> }/>
          <Route path="/assignments" element={<Assignments/> }/>
          <Route path="/reset-password" element={<PasswordResetRequest />} />
          <Route path="/create-employee" element={<EmployeePage/> }/>
        </Routes>
      </Router>
      </UriContext.Provider>
    </div>
  );
}

export default App;