import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Home from './screens/Home.js';
import FarmsDashboard from './screens/farms/FarmsDashboard.js';
import FarmDetail from './screens/farms/FarmDetail.js';
import FarmCreateForm from './screens/farms/FarmCreateForm.js';
import FarmUpdateForm from './screens/farms/FarmUpdateForm.js';
import DataVisualization from './screens/data_visualization/DataVisualization.js';
import SectorCreateForm from './screens/sectors/SectorCreateForm.js';
import SectorUpdateForm from './screens/sectors/SectorUpdateForm.js';
import DeviceCreateForm from './screens/devices/DeviceCreateForm.js';
import DevicesUpdateForm from './screens/devices/DeviceUpdateForm.js';
import ManageProfile from './screens/Profile.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>

        <Route path="/profile" element={<ManageProfile />} />
        <Route path="/farms" element={<FarmsDashboard />} />
        <Route path="/farms/:farmId" element={<FarmDetail />} />
        <Route path="/farms/:farmId/edit-farm" element={<FarmUpdateForm />} />
        <Route path="/farms/create-farm" element={<FarmCreateForm />} />
        <Route path="/farms/:farmId/create-sector" element={<SectorCreateForm />} />
        <Route path="/farms/:farmId/:sectorId/edit-sector" element={<SectorUpdateForm />} />
        <Route path="/farms/:farmId/create-device" element={<DeviceCreateForm />} />
        <Route path="/farms/:farmId/:deviceId/edit-device" element={<DevicesUpdateForm />} />
        <Route path="/farms/:farmId/visualization" element={<DataVisualization />} />
        <Route path="/" element={<Home />} />

      </Routes>
    </Router>

    <ToastContainer />

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
