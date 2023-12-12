import React, { PropsWithChildren, createContext, useState } from "react";

type SocketContextType = {
  socketData: any;
  setSocketData: (mode: string) => void;
};

export const SocketContext = createContext<SocketContextType>(
  {} as SocketContextType
);

export const SocketContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [socketData, setSocketData] = useState({});

  return (
    <SocketContext.Provider
      value={{
        socketData, setSocketData
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};