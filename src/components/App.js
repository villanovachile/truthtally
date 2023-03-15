import React from "react";
import { Routes, Route } from "react-router-dom";
import TruthTally from "./TruthTally";
import Header from "./Header";
import Error404 from "./Error404";

const App = () => {
  return (
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
  );
};

export default App;
