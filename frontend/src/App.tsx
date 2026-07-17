import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import IncidentPage from './pages/Incident';
import Mitre from './pages/Mitre';
import Simulator from './pages/Simulator';
import Settings from './pages/Settings';

const InvestigationPage = lazy(() => import('./pages/Investigation'));

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="incident" element={<IncidentPage />} />
          <Route path="investigation" element={
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-8 h-8 border-2 border-soc-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-soc-muted animate-pulse">Loading Investigation...</span>
                </div>
              </div>
            }>
              <InvestigationPage />
            </Suspense>
          } />
          <Route path="mitre" element={<Mitre />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
