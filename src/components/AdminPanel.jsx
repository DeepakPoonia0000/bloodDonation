// AdminPanel.jsx
import axios from 'axios';
import { useState, useEffect } from 'react';
import './styles/AdminPanel.css';
import { Link } from 'react-router-dom';

function AdminPanel({ setAdminToken }) {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [users, setUsers] = useState([])
    const token = localStorage.getItem('adminToken')

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const result = await axios.get('http://localhost:7000/pending-users', { headers: { Authorization: token } });
            setPendingUsers(result.data.pendingUsers);
            setRegisteredUsers(result.data.registeredUsers);
            console.log(result.data.registeredUsers)
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
            fetchPendingUsers();
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
        <div className="h-screen flex flex-col">
            {/* Top bar with title and logout button */}
            <div className="flex justify-between items-center p-4 border-b">
                <h2>Pending User Requests</h2>
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={adminLogOut}
                >
                    Log Out
                </button>
            </div>

            {/* Main content */}
            <div className="p-4 flex-grow">
                {pendingUsers.length === 0 ? (
                    <p>No Requests are pending</p>
                ) : (
                    <ul>
                        {pendingUsers.map(user => (
                            <li key={user._id} className="mb-4 flex items-center justify-center">
                                <div className="flex gap-4 flex-wrap">
                                    <p>Phone Number - {user.phoneNumber}</p>

                                    <button
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => handleApprove(user._id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => handleReject(user._id)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <h2 className="mt-8">Registered Users</h2>
                <ul className="admin-registeredUsers">
                    {registeredUsers.map(user => (
                        <Link to={`/userDetails?userId=${user._id}`} key={user._id}>
                            <li className="mb-4 border-b pb-4">
                                <p>UserId - {user._id}</p>
                                <p>Blood Group - {user.bloodGroup}</p>
                                <p>Joined On - {new Date(user.joinedOn).toLocaleDateString()}</p>
                                <p>Phone Number - {user.phoneNumber}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
        </div>

    );
}

export default AdminPanel;
