// EmployeeForm.js
import React, { useState, useEffect } from 'react';
import './EmployeeForm.css';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

const EmployeeForm = () => {
  const user = localStorage.getItem('user');
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    empId: '',
    department: '',
    role: 'employee',
    manager: user,
    email: '',
    empFirstName: '',
    empLastName: '',
    password: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token){
      navigate('/login');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send employee data to the backend
        const response = await fetch('http://localhost:3001/create-employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employee),
        });
      if(response.ok){
      alert('Employee created successfully!');
      setEmployee({
        empId: '',
        department: '',
        role: 'employee',
        manager: user,
        email: '',
        empFirstName: '',
        empLastName: '',
        password: '',
      })
    }
    } catch (error) {
      console.error('Error creating employee:', error.message);
    }
  };

    return (<>
        <NavBar onLogout={handleLogout} />
        <div className="employee-container">    
            <div className="employee-content">
                <div className="employee-fields">
                    <div className="form-field">
                        <label htmlFor="empId">Emp Id</label>
                        <input name="empId" id="empId" value={employee.empId} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label htmlFor="role">Department</label>
                        <input name="department" id="department" value={employee.department} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label htmlFor="forename">First Name</label>
                        <input name="empFirstName" id="forename" value={employee.empFirstName} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label htmlFor="surname">Last Name</label>
                        <input name="empLastName" id="surname" value={employee.empLastName} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <input name="email" id="email" type="email" value={employee.email} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label htmlFor="password">Password</label>
                        <input name="password" id="password" value={employee.password} onChange={handleChange} />
                    </div>
                    <button onClick={handleSubmit} className="save-button">Create Employee</button>
                </div>
            </div>
        </div>
        </>
    );
};

export default EmployeeForm;
