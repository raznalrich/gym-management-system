// UserTable.js
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';

const Customers = () => {
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

  const handleDelete = async (userId) => {
    await deleteDoc(doc(db, 'users', userId));
    setUsers(users.filter(user => user.id !== userId));
  };
  const filteredUsers = users.filter(user =>
    user.phoneNumber.includes(searchQuery)
  );

  return (
    <div className="table-container">
      <div className='customer-header'>
        <h2>Customers</h2>
        <input className='search' type='text' placeholder='Search by Ph No' value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>AD NO:</th>
            <th style={{ minWidth: '300px' }}>NAME</th>
            <th >PHONE</th>
            <th >ACTIONS</th>
          </tr>
        </thead>
        <tbody>
        {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.admissionNo}</td>
              <td className="user-name"><img src={user.profileImage} alt={user.name} width="36" height="36" style={{borderRadius:"30px"}} /><strong>{user.name}</strong></td>
              <td>{user.phoneNumber}</td>
              <td>
                <button className="button" onClick={() => setSelectedUser(user)}><FontAwesomeIcon icon={faEye} /></button>
                <button className="button button1" onClick={() => handleDelete(user.id)}><FontAwesomeIcon icon={faTrash} /></button>
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
            <h1>User Details</h1></th></tr></thead>
            <tbody>
            <tr><td><p><strong>Ad no:</strong> {selectedUser.admissionNo}</p></td></tr>
            <tr><td><p><strong>Name:</strong> {selectedUser.name}</p></td></tr>
            <tr><td> <p><strong>Joining Date:</strong> {selectedUser.joiningDate}</p></td></tr>
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
            <tr><td><img src={selectedUser.signature} alt={selectedUser.name} width="66" height="36" /></td></tr>
            <tr><td><Link to={`/edit/${selectedUser.id}`}><button className='button'>Edit</button></Link>
            <button className='button button1' onClick={() => setSelectedUser(null)}>Close</button></td></tr>
            </tbody>
            </table>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default Customers;
