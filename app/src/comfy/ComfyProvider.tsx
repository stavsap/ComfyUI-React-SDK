import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import axios from "axios";
import {Root, WORKFLOW} from "./api";

interface DataContextProps {
    fetchCheckpoints: () => Promise<string[]>;
    queuePrompt: () => Promise<any>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

interface DataProviderProps {
    children: ReactNode;
}

const fetchCheckpoints = async () => {
    // Implement your API fetching logic here
    return axios.get<Root>('object_info/CheckpointLoaderSimple', {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
        return res.data.CheckpointLoaderSimple.input.required.ckpt_name;
    })
};

export const ComfyProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        // let { hostname, port } = window.location;
        //
        // if(process.env.NODE_ENV === "development"){ // temp fix until more normal way to proxy web socket.
        //     hostname = "localhost"
        //     port = "8188"
        // }
        //
        // const ws = new WebSocket("ws://"+hostname+":"+port+"/ws?clientId=1122");
        //
        // // Define event handlers for the WebSocket connection
        // ws.onopen = () => {
        //     console.log('WebSocket connected');
        // };
        //
        // ws.onmessage = (event) => {
        //     const message = JSON.parse(event.data);
        //     console.log(message)
        // };
        //
        // ws.onclose = () => {
        //     console.log('WebSocket disconnected');
        // };
        //
        // // Store the WebSocket instance in state
        // setSocket(ws);
    }, [])

    const queuePrompt = async () => {
        WORKFLOW["3"].inputs.seed =  Math.round(Math.random()*100000)
        const data = { 'prompt': WORKFLOW, 'client_id': "1122"};

        const response = await fetch('/prompt', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response.json();
    }

    return (
        <DataContext.Provider value={{fetchCheckpoints ,queuePrompt}}>
            {children}
        </DataContext.Provider>
    );
};

export const useComfy = (): DataContextProps => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

