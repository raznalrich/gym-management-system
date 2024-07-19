// UserTable.js
import { faCheck, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { sendEmail } from '../components/emailservice';
import { db } from '../firebase';

const Pending = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    };

    fetchData();
  }, []);

  const handleUpdateRenewalDate = async (user) => {
    const currentRenewalDate = new Date(user.renewalDate);
    const newRenewalDate = new Date(currentRenewalDate.setMonth(currentRenewalDate.getMonth() + 1));

    await updateDoc(doc(db, 'users', user.id), {
      renewalDate: newRenewalDate.toISOString().split('T')[0] // Format as 'YYYY-MM-DD'
    });

    setUsers(users.map(u => u.id === user.id ? { ...u, renewalDate: newRenewalDate.toISOString().split('T')[0] } : u));
  };
  const handleEdit = (user) => {
    const message = `Just a friendly reminder that your membership at FITNESS+ expired on ${user.renewalDate}. We've loved having you as part of our fitness community, and we hope to see you continue your goals with us!
    Package Type : ${user.packageType} 
    Renewal Fee : ${user.rupees}
    `;
    sendEmail(user.email, user.name, message); // Send an email with a custom message when the edit button is clicked
    
  };

  const isDateExpired = (renewalDate) => {
    const currentDate = new Date();
    const dateToCompare = new Date(renewalDate);
    return dateToCompare <= currentDate;
  };

  const filteredUsers = users
    .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(user => isDateExpired(user.renewalDate));

  return (
    <div className="table-container">
      <div className='customer-header'>
        <h2>Pending Fees</h2>
        <input className='search' type='text' placeholder='Search.........' value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <table className="user-table">
        <thead>
          <tr>
            {/* <th style={{ width: '60px' }}>Profile</th> */}
            <th style={{ minWidth: '300px' }}>NAME</th>
            <th>FEES</th>
            <th>RENEWAL</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              {/* <td><img src={user.profileImage} alt={user.name} width="50" style={{borderRadius:"30px"}} /></td> */}
              <td className="user-name"><img src={user.profileImage} alt={user.name} width="36" height="36" style={{borderRadius: "30px"}} /><strong>{user.name}</strong></td>
              <td>{user.rupees}</td>
              <td>Pending</td>
              <td>
                <button className="button" onClick={() => setSelectedUser(user)}><FontAwesomeIcon icon={faEye} /></button>
                <button className="button button2" onClick={() => handleUpdateRenewalDate(user)}><FontAwesomeIcon icon={faCheck} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="popup">
          <div className="popup-content">
            <table className='user-details'>
              <thead>
                <tr>
                  <th>
                    <h1>User Details</h1>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr><td><p><strong>Name:</strong> {selectedUser.name}</p></td></tr>
                <tr><td><p><strong>Joining Date:</strong> {selectedUser.joiningDate}</p></td></tr>
                <tr><td><p><strong>Age:</strong> {selectedUser.age}</p></td></tr>
                <tr><td><p><strong>Phone Number:</strong> {selectedUser.phoneNumber}</p></td></tr>
                <tr><td><p><strong>Email:</strong> {selectedUser.email}</p></td></tr>
                <tr><td><p><strong>Occupation:</strong> {selectedUser.occupation}</p></td></tr>
                <tr><td><p><strong>Height:</strong> {selectedUser.height}</p></td></tr>
                <tr><td><p><strong>Sex:</strong> {selectedUser.sex}</p></td></tr>
                <tr><td><p><strong>Weight:</strong> {selectedUser.weight}</p></td></tr>
                <tr><td><p><strong>Waist:</strong> {selectedUser.waist}</p></td></tr>
                <tr><td><p><strong>Package:</strong> {selectedUser.packageType}</p></td></tr>
                <tr><td><p><strong>Rupees:</strong> ₹ {selectedUser.rupees}</p></td></tr>
                <tr><td>
                  <button className='button' onClick={() => handleEdit(selectedUser)}>Send Mail</button>
                  <button className='button button1' onClick={() => setSelectedUser(null)}>Close</button>
                </td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pending;
