import React from 'react';
import './App.css';
import {ChakraProvider} from '@chakra-ui/react'
import Dashboard from "./dashboard/dashboard";
import {ComfyProvider} from "./compfy-api/ComfyProvider";

function App() {

  return (
      <ChakraProvider>
        <ComfyProvider>
          <Dashboard></Dashboard>
        </ComfyProvider>
      </ChakraProvider>

  );
}

export default App;
