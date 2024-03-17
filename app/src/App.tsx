import React from 'react';
import './App.css';
import Dashboard from "./dashboard/dashboard";
import {ComfyProvider} from "./comfy/ComfyProvider";

function App() {
  return (
      <ComfyProvider>
          <Dashboard></Dashboard>
      </ComfyProvider>
  );
}

export default App;
