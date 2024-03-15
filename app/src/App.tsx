import React, { useState, useEffect }  from 'react';
import logo from './logo.svg';
import './App.css';
import {Generate, getCheckpoints} from "./compfy-api/api";
const WS_MESSAGE_TYPE_EXECUTING="executing"
const WS_MESSAGE_TYPE_EXECUTED="executed"
const WS_MESSAGE_TYPE_STATUS="status"
const WS_MESSAGE_TYPE_PROGRESS="progress"
const WS_MESSAGE_TYPE_EXECUTION_START="execution_start"
const WS_MESSAGE_TYPE_EXECUTION_CACHED="execution_cached"
function App() {

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [rand, setRand] = useState<number>(Math.random);
  const [image, setImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Create a WebSocket connection when the component mounts
    let { hostname, port } = window.location;

    // the proxy not working yet. enable when working with local dev via 'npm start'
    // hostname = "localhost"
    // port = "8188"

    const ws = new WebSocket("ws://"+hostname+":"+port+"/ws?clientId=1122");

    // Define event handlers for the WebSocket connection
    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if(message.type === WS_MESSAGE_TYPE_EXECUTED){
          setImage(message.data.output.images[0].filename)
      }
      console.log(message)
      setMessages(prevMessages => [...prevMessages, message]);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    // Store the WebSocket instance in state
    setSocket(ws);

    // Close the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);


  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <button onClick={getCheckpoints}>Fetch Checkpoints</button>
          <button onClick={Generate}>Run Workflow</button>
          {image != null && <a href={`/view?filename=${image}&type=output&rand=${rand}`} data-type="image">
            <img src={`/view?filename=${image}&type=output&rand=${rand}`} alt=""/></a>}

        </header>


      </div>
  );
}

export default App;
