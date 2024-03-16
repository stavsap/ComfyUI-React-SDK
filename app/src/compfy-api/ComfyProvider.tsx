import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from "axios";
import {Root} from "./api";

interface DataContextProps {
    fetchCheckpoints: () => Promise<string[]>;
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


    return (
        <DataContext.Provider value={{fetchCheckpoints }}>
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

