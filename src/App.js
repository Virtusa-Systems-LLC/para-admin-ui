import "./App.css";
// import { useState } from "react";
import Dashboard from "./components/Dashboard/Dashboard";
// import SideMenu from "./components/SideMenu/SideMenu";
// import Iframe from "react-iframe";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OriginalAuth from "./components/OriginalAuth";
import ObjectLinking from "./components/ObjectLinking/ObjectLinking";
import MainComponent from "./MainComponent";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/ecs-healthcheck-ui" element={<>Hello from ui!</>} />
          <Route path="/" element={<MainComponent />}>
            <Route exact path="/1" element={<Dashboard />} />
            <Route exact path="/2" element={<OriginalAuth />} />
            <Route exact path="/3" element={<ObjectLinking />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
