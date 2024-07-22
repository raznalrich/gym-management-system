import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaUserAlt, FaUserPlus } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { db } from '../firebase';

function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    };

    fetchData();
  }, []);

  const currentDate = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth();
  const filteredUsers = users.filter(user => 
    new Date(user.joiningDate).toISOString().split('T')[0] === currentDate
  );

  const getTotalFees = () => {
    return users.reduce((total, user) => total + (user.rupees || 0) + 1000, 0);
  };

  const newUsersThisMonth = users.filter(user => 
    new Date(user.joiningDate).getMonth() === currentMonth
  ).length;


  const getMonthlyUserData = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const userCounts = months.map((month, index) => ({
      month,
      count: users.filter(user => new Date(user.joiningDate).getMonth() === index).length
    }));
    return userCounts;
  };

  const monthlyUserData = getMonthlyUserData();

  return (
    <div>
      <div className='dashboard'>
        <div className="header">
          <h1>Welcome!</h1>
          <p>Team <strong>FITNESS +</strong></p>
        </div>
        <div className="boxes">
          <div className="tcustomer">
            <div className="logo">
              <FaUserAlt size={40} className='logo1' />
            </div>
            <div className="details">
              <p>Total Members</p>
              <h1>{users.length}</h1>
            </div>
          </div>
          <div className="tearnings">
            <div className="logo">
              <FaDollarSign size={40} className='logo1' />
            </div>
            <div className="details">
              <p>Total Earnings</p>
              <h1>₹{getTotalFees()}</h1>
            </div>
          </div>
          <div className="tadmission">
            <div className="logo">
              <FaUserPlus size={40} className='logo1' />
            </div>
            <div className="details">
              <p>This Month</p>
              <h1>{newUsersThisMonth}</h1>
            </div>
          </div>
        </div>
        <div className="newcomers">
          <div className='customer-header'>
            <h2>New Admission :</h2>
            <Link to={`/admission`}><button className="button button2" type="submit">Add Customers</button></Link>
          </div>
          <table className="user-table">
            <thead>
              <tr>
                <th style={{ minWidth: '300px' }}>NAME</th>
                <th>JOINED ON</th>
                <th>PACKAGE</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="3">No new members</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td className="user-name">
                      <img src={user.profileImage} alt={user.name} width="36" height="36" style={{ borderRadius: "30px" }} />
                      <strong>{user.name}</strong>
                    </td>
                    <td>{user.joiningDate}</td>
                    <td>{user.packageType}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div><div className="header-graph">

        <h2>Analysis Graph :</h2>
        </div>
        <div className="chart-container" style={{ width: '100%', height: 400 ,paddingTop: 40}}>
          <ResponsiveContainer>
            <BarChart data={monthlyUserData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
