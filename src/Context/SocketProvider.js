import React, { createContext, useContext } from 'react';
import {io} from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () =>{
    return useContext(SocketContext);
}

const SocketProvider = ({children}) => {


    const initSocket = async () => {
        const options = {
            'force new connection': true,
            reconnectionAttempt: 'Infinity',
            timeout: 10000,
            transports: ['websocket'],
        };
        return io('http://localhost:5000/', options);
    };



    return (
        <SocketContext.Provider value={{initSocket}}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;