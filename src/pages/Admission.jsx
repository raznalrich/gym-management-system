import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook
import { db, storage } from '../firebase';

function Admission() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [sex, setSex] = useState('');
  const [occupation, setOccupation] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [age, setAge] = useState('');
  const [blood, setBlood] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [packageType, setPackageType] = useState('');
  const [rupees, setRupees] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();
  const handlePackageChange = (e) => {
    const selectedPackage = e.target.value;
    setPackageType(selectedPackage);

    switch (selectedPackage) {
      case 'Normal Package':
        setRupees(500);
        break;
      case 'Normal Package + Thread Mill':
        setRupees(800);
        break;
      case 'Thread Mill':
        setRupees(300);
        break;
      case 'Personal Training':
        setRupees(4000);
        break;
      case '3 Months':
        setRupees(1500);
        break;  
      default:
        setRupees('');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profileImage) {
      const storageRef = ref(storage, profileImage.name);
      await uploadBytes(storageRef, profileImage);
      const currentDate = new Date().toISOString().split('T')[0];
      const fileURL = await getDownloadURL(storageRef);

      const renewalDate = new Date();
      renewalDate.setMonth(renewalDate.getMonth() + 1);
      const renewalDateString = renewalDate.toISOString().split('T')[0];

      await addDoc(collection(db, 'users'),{
        name,
        packageType,
        dob,
        age,
        sex,
        phoneNumber,
        address,
        blood,
        email,
        height,
        weight,
        waist,
        occupation,
        rupees,
        profileImage: fileURL,
        joiningDate: currentDate,
        renewalDate: renewalDateString, // Add renewal date
      });

      setName('');
      setEmail('');
      setDob('');
      setBlood('');
      setAge('');
      setSex('');
      setAddress('');
      setHeight('');
      setOccupation('');
      setPhoneNumber('');
      setPackageType('');
      setRupees('');
      setProfileImage(null);
      navigate('/customers');  // Navigate to Customer page
    } else {
      alert('Please upload a profile image.');
    }
  };
  return (
    <div className="formcontainer">

    <form className='form' onSubmit={handleSubmit}>
      <h1>
        New Admission
      </h1>
      <label>Name</label>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label>Profile pic</label>
      <input
        type="file"
        onChange={(e) => setProfileImage(e.target.files[0])}
        required
      />
      <label>Email</label>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label>Age</label>
      <input
        type="text"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      <label>Date Of Birth</label>
      <input
        type="date"
        placeholder="Date of Birth"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        required
      />
      <label>Sex</label>
      <select value={sex} onChange={(e) => setSex(e.target.value)} required>
        <option value="">Select Sex</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <label>Blood group</label>
      <input
        type="text"
        placeholder="Blood Group"
        value={blood}
        onChange={(e) => setBlood(e.target.value)}
        required
      />
      <label>Address</label>
      <textarea type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required/>
      <label>Phone</label>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <label>Occupation</label>
      <input
        type="text"
        placeholder="Occupation"
        value={occupation}
        onChange={(e) => setOccupation(e.target.value)}
        required
      />
      <label>Height</label>
      <input
        type="text"
        placeholder="Height"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        required
      />
      <label>Weight</label>
      <input
        type="text"
        placeholder="Weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        required
      />
      <label>Waist</label>
      <input
        type="text"
        placeholder="Waist"
        value={waist}
        onChange={(e) => setWaist(e.target.value)}
        required
      />
      <label>Choose Package</label>
      <select value={packageType} onChange={handlePackageChange} required>
        <option value="">Select Package</option>
        <option value="Normal Package">Normal Package</option>
        <option value="Normal Package + Thread Mill">Normal Package + Thread Mill</option>
        <option value="Thread Mill">Thread Mill</option>
        <option value="Personal Training">Personal Training</option>
        <option value="3 Months">3 Months</option>
      </select>
      <input
        type="number"
        placeholder="Rupees"
        value={rupees}
        readOnly
      />
      <button type="submit">Submit</button>
    </form>
    </div>
  )
}

export default Admission;