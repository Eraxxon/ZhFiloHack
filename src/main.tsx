import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeeDetailPage } from './pages/EmployeeDetailPage';
import { CareerTracksPage } from './pages/CareerTracksPage';
import './styles/global.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/employee/:guid" element={<EmployeeDetailPage />} />
        <Route path="/career-tracks" element={<CareerTracksPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


