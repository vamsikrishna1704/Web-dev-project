import React, { useState, useEffect, useContext } from 'react';
import './Profile.css';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import UriContext from '../UriContext';

function ProfilePage() {
    const uri = useContext(UriContext);
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [profile, setProfile] = useState({
        empId: '', // Assuming empId is part of the profile data
        empFirstName: '',
        empLastName: '',
        phone: '',
        email: '',
        birthDate: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }

        const fetchProfile = async () => {
            const user = localStorage.getItem('user');
            try {
                const response = await fetch(uri+'/get-employee', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 'user': user }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data); // Set the profile data including empId
                } else {
                    console.error('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleImageChange = (event) => {
        setProfileImage(URL.createObjectURL(event.target.files[0]));
    };

    const handleSubmit = async () => {
        const response = await fetch(uri+'/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                empId: profile.empId, // Sending empId along with the profile data
                profileData: profile
            }),
        });
        if (response.ok) {
            alert('Profile updated successfully');
            window.location.reload();
        } else {
            console.error('Failed to update profile');
        }
    };

    return (
        <div className="profile-container">
            <NavBar onLogout={handleLogout} />
            <div className="profile-content">
                <div className="card profile-image-card">
                    <div className="card-header">Profile Picture</div>
                    <div className="card-body text-center">
                        <img src={profileImage || 'default-profile.jpg'} alt="Profile" className="profile-image" />
                        <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                        <input id="profileImage" type="file" onChange={handleImageChange} hidden />
                        <button className="btn btn-primary" onClick={() => document.getElementById('profileImage').click()}>
                            Upload new image
                        </button>
                    </div>
                </div>
                <div className="profile-fields">
                    <div className="form-field">
                        <label htmlFor="forename">First Name</label>
                        <input name="empFirstName" id="forename" value={profile.empFirstName || ''} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label htmlFor="surname">Last Name</label>
                        <input name="empLastName" id="surname" value={profile.empLastName || ''} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label htmlFor="phone">Phone</label>
                        <input name="phone" id="phone" type="tel" value={profile.phone || ''} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <input name="email" id="email" type="email" value={profile.email || ''} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label htmlFor="birthDate">Birth Date</label>
                        <input name="birthDate" id="birthDate" type="text" value={profile.birthDate || ''} placeholder='dd/mm/yyyy' onChange={handleChange} />
                    </div>
                    <button onClick={handleSubmit} className="save-button">Save Changes</button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
