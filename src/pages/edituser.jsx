// // EditUser.js
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { db } from '../firebase';

// const EditUser = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   // const handlePackageChange = (e) => {
//   //   const selectedPackage = e.target.value;
//   //   setPackageType(selectedPackage);

//   //   switch (selectedPackage) {
//   //     case 'Normal Package':
//   //       setRupees(500);
//   //       break;
//   //     case 'Normal Package + Thread Mill':
//   //       setRupees(800);
//   //       break;
//   //     case 'Thread Mill':
//   //       setRupees(300);
//   //       break;
//   //     case '3 months + 3 TM':
//   //       setRupees(2200);
//   //       break;
//   //     case '3 Months':
//   //       setRupees(1300);
//   //       break;
//   //     default:
//   //       setRupees('');
//   //   }
//   // };

//   useEffect(() => {
//     const fetchUser = async () => {
//       const userDoc = await getDoc(doc(db, 'users', id));
//       if (userDoc.exists()) {
//         setUser({ id: userDoc.id, ...userDoc.data() });
//       } else {
//         console.log("No such document!");
//       }
//     };

//     fetchUser();
//   }, [id]);

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     await updateDoc(doc(db, 'users', user.id), user);
//     navigate('/');
//   };

//   if (!user) return <div>Loading...</div>;

//   return (
//     <div className="formcontainer">

//     <form onSubmit={handleUpdate} className="form">
//       <h1>Edit User</h1>
//       <label>Name</label>
//       <input
//         type="text"
//         value={user.name}
//         onChange={(e) => setUser({ ...user, name: e.target.value })}
//         required
//       />
//       <label>Package</label>
//       <select
//         value={user.packageType}
//         onChange={(e) => setUser({ ...user, packageType: e.target.value })}
//         required
//       >
//         <option value="">Select Package</option>
//           <option value="Normal Package">Normal Package</option>
//           <option value="Normal Package + Thread Mill">Normal Package + Thread Mill</option>
//           <option value="Thread Mill">Thread Mill</option>
//           <option value="3 months + 3 TM">3 months + 3 TM</option>
//           <option value="3 Months">3 Months</option>
//       </select>
//       <input
//         type="number"
//         value={user.rupees}
//         readOnly
//       />
//       <button type="submit">Update</button>
//     </form>
//     </div>
//   );
// };


// export default EditUser;

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const storage = getStorage();

  const handlePackageChange = (e) => {
    const selectedPackage = e.target.value;
    setUser((prevUser) => ({
      ...prevUser,
      packageType: selectedPackage,
      rupees: calculateRupees(selectedPackage),
    }));
  };

  const calculateRupees = (selectedPackage) => {
    switch (selectedPackage) {
      case 'Normal Package':
        return 500;
      case 'Normal Package + Thread Mill':
        return 800;
      case 'Thread Mill':
        return 300;
      case '3 months + 3 TM':
        return 2200;
      case '3 Months':
        return 1300;
      default:
        return '';
    }
  };

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

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const uploadProfileImage = async () => {
    if (!profileImage) return null;
    const storageRef = ref(storage, `profileImages/${profileImage.name}`);
    await uploadBytes(storageRef, profileImage);
    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    let updatedUser = { ...user };

    // If a new profile image is selected, upload it
    if (profileImage) {
      const imageUrl = await uploadProfileImage();
      if (imageUrl) {
        updatedUser = { ...updatedUser, profileImageUrl: imageUrl };
      }
    }

    await updateDoc(doc(db, 'users', user.id), updatedUser);
    navigate('/');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="formcontainer">
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
          onChange={handlePackageChange}
          required
        >
          <option value="">Select Package</option>
          <option value="Normal Package">Normal Package</option>
          <option value="Normal Package + Thread Mill">Normal Package + Thread Mill</option>
          <option value="Thread Mill">Thread Mill</option>
          <option value="3 months + 3 TM">3 months + 3 TM</option>
          <option value="3 Months">3 Months</option>
        </select>

        <input
          type="number"
          value={user.rupees}
          readOnly
        />

        <label>Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
        />
        {user.profileImageUrl && (
          <img src={user.profileImageUrl} alt="Profile" width={100} height={100} />
        )}

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditUser;
