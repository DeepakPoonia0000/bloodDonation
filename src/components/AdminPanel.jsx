// AdminPanel.jsx
import axios from 'axios';
import { useState, useEffect } from 'react';

function AdminPanel({ setAdminToken }) {
    const [pendingUsers, setPendingUsers] = useState([]);
    const token = localStorage.getItem('adminToken')

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const result = await axios.get('http://localhost:7000/pending-users', { headers: { Authorization: token } });
            setPendingUsers(result.data);
        } catch (error) {
            console.log("error is in fetchPendingUsers")
            console.error('Request failed:', error);
        }

    };

    const handleApprove = async (id) => {
        try {
            await axios.put('http://localhost:7000/approve-user', { id }, {
                headers: { Authorization: token }
            });
            setPendingUsers(pendingUsers.filter(user => user._id !== id));

        } catch (error) {
            console.log("Error in handleApprove");
            console.error('Request failed:', error);
        }
    };

    const handleReject = async (id) => {
        console.log(id)
        try {
            const response = await axios.delete('http://localhost:7000/reject-user', {
                params: { id },
                headers: { Authorization: token }
            });
            console.log(response)
            setPendingUsers(pendingUsers.filter(user => user._id !== id));
        } catch (error) {
            console.log("Error in handleReject");
            console.error('Request failed:', error);
        }
    };


    const adminLogOut = () => {
        localStorage.clear();
        setAdminToken('');
    }

    return (
        <div>
            <h2>Pending User Requests</h2>
            {pendingUsers.length === 0 ? (
                <p>No Requests are pending</p>
            ) : (
                <ul>
                    {pendingUsers.map(user => (
                        <li key={user._id}>
                            <p>Phone Number - {user.phoneNumber}</p>
                            <button onClick={() => handleApprove(user._id)}>Approve</button>
                            <button onClick={() => handleReject(user._id)}>Reject</button>
                            <br /><br />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AdminPanel;
