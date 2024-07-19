// EditUser.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, 'users', id));
      if (userDoc.exists()) {
        setUser({ id: userDoc.id, ...userDoc.data() });
      } else {
        console.log("No such document!");
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'users', user.id), user);
    navigate('/');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <form onSubmit={handleUpdate} className="form">
      <h1>Edit User</h1>
      <label>Name</label>
      <input
        type="text"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        required
      />
      <label>Package</label>
      <select
        value={user.packageType}
        onChange={(e) => setUser({ ...user, packageType: e.target.value })}
        required
      >
        <option value="A">Package A</option>
        <option value="B">Package B</option>
        <option value="C">Package C</option>
      </select>
      <input
        type="number"
        value={user.rupees}
        readOnly
      />
      <button type="submit">Update</button>
    </form>
  );
};

export default EditUser;
