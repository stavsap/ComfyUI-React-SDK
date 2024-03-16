import React, {useEffect, useState} from 'react';
import {useComfy} from "../compfy-api/ComfyProvider";
import logo from "../logo.svg";
import {Box, Button, Image, Stack} from "@chakra-ui/react";
import { Spinner } from '@chakra-ui/react'
import {GetWebSocket, WS_MESSAGE_TYPE_EXECUTED} from "../compfy-api/api";

const Dashboard = () => {

    const {queuePrompt, fetchCheckpoints } = useComfy();
    const [rand, setRand] = useState<number>(Math.random);
    const [image, setImage] = useState<string | null>(null);

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
        const ws = GetWebSocket()

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if(message.type === WS_MESSAGE_TYPE_EXECUTED){
                setImage(message.data.output.images[0].filename)
            }
            console.log(message)
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
