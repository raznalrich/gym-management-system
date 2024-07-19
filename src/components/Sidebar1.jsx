import React, { useState } from 'react';
import { FaBars, FaChartBar, FaHistory, FaPlus, FaTh, FaUserAlt } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import logo from '../data/IMG_9089-removebg-preview.png';

function Sidebar({children}) {
    const[isOpen , setisOpen] = useState(false);
  const toggle =() => setisOpen(!isOpen);
    const menuitems=[
        {
            path:"/",
            name:"dashboard",
            icon:<FaTh/>
        },
        {
            path:"/admission",
            name:"Admission",
            icon:<FaPlus/>
        },
        {
            path:"/customers",
            name:"Customers",
            icon:<FaUserAlt/>
        },
        {
            path:"/pending",
            name:"Pending",
            icon:<FaHistory/>
        },
        {
            path:"/analysis",
            name:"Analysis",
            icon:<FaChartBar/>
        },
    ];
  return (
    <div className='container'>
        <div style={{width: isOpen ? "300px" : "50px"}} className="sidebar">
            <div className="top_section">
                <img style={{display: isOpen ? "block" : "none"}} src={logo} alt="logo" className="logo_img" />
                <h2 style={{display: isOpen ? "block" : "none"}} className="logo">FITNESS+</h2>
                <div style={{marginLeft: isOpen ? "30px" : "1px"}} className="bar">
                    <FaBars  onClick={toggle}/>
                </div>
            </div>
            {
                menuitems.map((item , index)=>(
                    <NavLink to={item.path} key={index} className="link" activeclassname='active'>
                        <div className="icon">{item.icon}</div>
                        <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                    </NavLink>
                ))
            }
        </div>
            <main>
                {children}
            </main>
    </div>
  )
}

export default Sidebar