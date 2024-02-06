import React from 'react';
import { Container, Paper, Typography, Button } from '@mui/material';

export default function ProfilePage() {

    const profileData = {
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        phoneNumber: '123-456-7890',
        username: 'example_user',
        password: '********',
        ssn: '123-45-6789',
        serviceRequests: [
            { id: 1, description: 'Request 1', status: 'Fulfilled' },
            { id: 2, description: 'Request 2', status: 'In Progress' },
            { id: 3, description: 'Request 3', status: 'Submitted' },
        ],
    };

    const handlePasswordChange = () => {
        // Implement the logic to redirect to the password change page
        window.location.href = '/change-profile';
    };

    const listItemStyle = { marginLeft: '20px', marginBottom: '20px' };

    return (
        <Container maxWidth="md" style={{ display: 'flex' }}>
            <Container style={{ marginRight: '40px' }}> {/* Increased marginRight */}
                <Paper elevation={3} style={{ padding: '30px', width: '100%', marginTop: '20px' }}>
                    <Typography variant="h5" gutterBottom>
                        Profile Information
                    </Typography>
                    <Typography variant="body1" style={listItemStyle}>
                        <strong>First Name:</strong> {profileData.firstName}
                    </Typography>
                    <Typography variant="body1" style={listItemStyle}>
                        <strong>Last Name:</strong> {profileData.lastName}
                    </Typography>
                    <Typography variant="body1" style={listItemStyle}>
                        <strong>Username:</strong> {profileData.username}
                    </Typography>
                    <div style={{ marginTop: '20px' }}>
                        <Button variant="contained" color="primary" onClick={handlePasswordChange}>
                            Change Password
                        </Button>
                    </div>
                </Paper>
            </Container>
            <Container style={{ marginTop: '20px' }}> {/* Increased marginTop */}
                <Paper elevation={3} style={{ padding: '30px', width: '100%' }}>
                    <Typography variant="h5" gutterBottom>
                        Service Requests
                    </Typography>
                    {profileData.serviceRequests.map((request) => (
                        <div key={request.id} style={listItemStyle}>
                            <Typography>
                                <strong>Description:</strong> {request.description}
                            </Typography>
                            <Typography>
                                <strong>Status:</strong> {request.status}
                            </Typography>
                        </div>
                    ))}
                </Paper>
            </Container>
        </Container>
    );
}
