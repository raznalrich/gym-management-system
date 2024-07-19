import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from "./components/Sidebar1";
import Admission from './pages/Admission';
import Analysis from './pages/Analysis';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import EditUser from './pages/edituser';
import Pending from './pages/pending';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Sidebar>

      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/admission' element={<Admission/>}/>
        <Route path="/edit/:id" element={<EditUser />} />
        <Route path='/customers' element={<Customers/>}/>
        <Route path='/analysis' element={<Analysis/>}/>
        <Route path='/pending' element={<Pending/>}/>
      </Routes>
      
      </Sidebar>
      </BrowserRouter>
    </div>
  );
}

export default App;
