import React, {useEffect, useState} from 'react';

import {useComfy} from "../compfy-api/ComfyProvider";
import logo from "../logo.svg";
import {Box, Button, Image, Stack} from "@chakra-ui/react";
import { Spinner } from '@chakra-ui/react'


const WS_MESSAGE_TYPE_EXECUTING="executing"
const WS_MESSAGE_TYPE_EXECUTED="executed"
const WS_MESSAGE_TYPE_STATUS="status"
const WS_MESSAGE_TYPE_PROGRESS="progress"
const WS_MESSAGE_TYPE_EXECUTION_START="execution_start"
const WS_MESSAGE_TYPE_EXECUTION_CACHED="execution_cached"


const Dashboard = () => {

    const {queuePrompt, fetchCheckpoints } = useComfy();

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [rand, setRand] = useState<number>(Math.random);
    const [image, setImage] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    function updateCheckpoint(){
        fetchCheckpoints().then(checkpoints=>{
            console.log(checkpoints)
        })
    }

    function generate(){
        queuePrompt().then(res=>{
            console.log(res)
        })
    }

    useEffect(() => {
        // Create a WebSocket connection when the component mounts
        let { hostname, port } = window.location;

        if(process.env.NODE_ENV === "development"){ // temp fix until more normal way to proxy web socket.
            hostname = "localhost"
            port = "8188"
        }

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
                <Box boxSize='sm'>
                    {/*<Spinner*/}
                    {/*    thickness='4px'*/}
                    {/*    speed='0.65s'*/}
                    {/*    emptyColor='gray.200'*/}
                    {/*    color='blue.500'*/}
                    {/*    size='xl'*/}
                    {/*/>*/}
                    {image &&
                        <Image src={`/view?filename=${image}&type=output&rand=${rand}`} alt=''/>
                    }
                </Box>
                <Stack direction='row'>
                    <Button colorScheme='blue' onClick={updateCheckpoint}>Fetch Checkpoints</Button>
                    <Button colorScheme='blue' onClick={generate}>Generate</Button>
                </Stack>

            </header>
        </div>
    );
};

export default Dashboard;
