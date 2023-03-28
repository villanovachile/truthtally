import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import TruthTally from './TruthTally';
import Header from './Header';
import Error404 from './Error404';

const App = () => {
  return (
    <>
      <ReactNotifications />
      <div className="main-container">
        <Header />

        <Routes>
          <Route path="/" element={<TruthTally />} />
          <Route path="/*" element={<Error404 />} />
          <Route path="/list">
            <Route path="/list/404" element={<Error404 />} />
            <Route index element={<TruthTally />} />
            <Route path=":uri" element={<TruthTally />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
