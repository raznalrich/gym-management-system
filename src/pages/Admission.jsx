import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from 'react';
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
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
  const [sign, setSign] = useState(null);

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
      case '3 months + 3 TM':
        setRupees(2200);
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

    if (profileImage && sign) {
      const profileImageRef = ref(storage, profileImage.name);
      await uploadBytes(profileImageRef, profileImage);
      const profileImageURL = await getDownloadURL(profileImageRef);

      const signDataURL = sign.getTrimmedCanvas().toDataURL('image/png');
      const signBlob = await fetch(signDataURL).then(res => res.blob());
      const signRef = ref(storage, `${name}_signature.png`);
      await uploadBytes(signRef, signBlob);
      const signURL = await getDownloadURL(signRef);

      const currentDate = new Date().toISOString().split('T')[0];
      const renewalDate = new Date();
      if (packageType === '3 Months') {
        renewalDate.setMonth(renewalDate.getMonth() + 3);
      } else {
        renewalDate.setMonth(renewalDate.getMonth() + 1);
      }
      const renewalDateString = renewalDate.toISOString().split('T')[0];

      await addDoc(collection(db, 'users'), {
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
        profileImage: profileImageURL,
        signature: signURL,
        joiningDate: currentDate,
        renewalDate: renewalDateString,
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
      sign.clear();
      navigate('/customers');
    } else {
      alert('Please upload a profile image and provide your signature.');
    }
  };

  return (
    <div className="formcontainer">
      <form className='form' onSubmit={handleSubmit}>
        <div style={{display:"Flex",alignItems:"center",gap:"15px",paddingBottom:"20px",borderBottom:"2px solid black"}}>
        <FaUserPlus  size={40}/><h1>New Admission</h1>
        </div>
        <br/>
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
        <textarea
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
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
          <option value="3 months + 3 TM">3 months + 3 TM</option>
          <option value="3 Months">3 Months</option>
        </select>
        <input
          type="number"
          placeholder="Rupees"
          value={rupees}
          readOnly
        />
        <h2>നിബന്ധനകൾ :</h2>
        <ul>
          <li>അംഗങ്ങൾ കർശനമായി അച്ചടക്കം പാലിക്കേണ്ടതാണ് .</li>
          <li>മെമ്പർഷിപ് കൈമാറ്റം ചെയ്യാൻ പാടുള്ളതല്ല , 6 മാസം തുടർച്ചയായി മുടങ്ങിയാൽ അഡ്മിഷൻ റദ്ദാവുന്നതാണ്</li>
          <li>എല്ലാ മാസവും 1 മുതൽ 10 -o  തിയതിക്കകം ഫീസ് അടച്ചിരിക്കേണ്ടതാണ് . അല്ലാത്തപക്ഷം ഫൈൻ ഈടാക്കുന്നതാണ് .</li>
          <li>ഫീസ് അടച്ചതിന്റെ രസീത് കൈപ്പറ്റേണ്ടതാണ് . അല്ലാത്തപക്ഷം ഫീസ് അടച്ചതായി പരിഗണിക്കുന്നതല്ല .</li>
          <li>ഒരിക്കൽ അടച്ച അഡ്വാൻസ് ഫീസും , മാസഫീസും മടക്കിത്തരുന്നതല്ല . ക്ലബിലെ ഉപകരണങ്ങൾ ഉപയോഗത്തിനുശേഷം യഥാസ്ഥാനങ്ങളിൽ തിരികെ വെയ്‌ക്കേണ്ടതാണ് .</li>
          <li>പരിശീലനത്തിനിടയിൽ ഉണ്ടാക്കുന്ന ഏതെങ്കിലും രോഗം സ്ഥിരീകരിക്കപ്പെട്ടിട്ടുള്ളവർ ഡോക്ടറുടെ പൂർണ ആരോഗ്യ സർട്ടിഫിക്കറ്റ് ഹാജരാക്കേണ്ടതാണ് .</li>
          <li>ലഹരി കഴിച്ചുകൊണ്ട് ക്ലബിനുള്ളിൽ പ്രവേശിക്കാൻപാടുള്ളതല്ല</li><br/>
          <i><p>മേൽപറഞ്ഞ നിബന്ധനകൾ ബോധ്യപ്പെടുകയും അവയെല്ലാം സ്വീകാര്യമാണ് സത്യപ്രസ്താവന ചെയ്യുന്നു .</p></i>
        </ul>
        <div style={{border:"2px solid black"}}>
          <SignatureCanvas
            canvasProps={{width: 500, height: 200}}
            ref={data => setSign(data)}
          />
        </div>
        <button type="button" onClick={() => sign.clear()}>Clear</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Admission;
