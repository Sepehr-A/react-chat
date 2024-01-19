import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Chat from "../Pages/Chat";

const AppRoutes = ({
                       messages,
                       message,
                       setMessage,
                       selectedUser,
                       handleKeyDown,
                       sendMessage,
                   }) => {
    return (
        <Routes>
            <Route path="/" element={
                <Chat
                    messages={messages}
                    message={message}
                    setMessage={setMessage}
                    selectedUser={selectedUser}
                    handleKeyDown={handleKeyDown}
                    sendMessage={sendMessage}/>
            }/>
        </Routes>
    );
};

export default AppRoutes;
