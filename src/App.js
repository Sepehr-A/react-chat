import {useState, useEffect} from 'react';
import './App.css';
import Chat from './utils/Chat';
import SERVER_URL from './utils/config';

function App() {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');

    const sendMessage = (messageText) => {
        if (!messageText.trim()) return;

        const messageData = {
            user_id: selectedUser,
            text: messageText,
            timestamp: new Date().toISOString()
        };
        console.log(JSON.stringify(messageData))

        fetch(`${SERVER_URL}/api/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Assuming data.gptReply contains the reply message
                if (data.success) {
                    // Update messages state with the user's message and the server's reply (GPT reply)
                    setMessages(prevMessages => [
                        ...prevMessages,
                        {...messageData, role: 'client'},
                        {text: data.gptReply, role: 'server', timestamp: new Date().toISOString()}
                    ]);
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
                // setServerError('Failed to send message'); // Uncomment if you want to use serverError
            });
    };


    const updateMessages = (newMessages) => {
        setMessages(newMessages);
    };

    const fetchMessages = (userId) => {
        fetch(`${SERVER_URL}/api/messages?userId=${userId}`)
            .then(response => response.json())
            .then(data => setMessages(data.allMessages)) // Update here to match server's response
        // .catch(error => setServerError('Failed to load messages'));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage(message);
            setMessage('');
        }
    };
    // todo show user message as soon as they hit enter not with the answer
    useEffect(() => {
        let userIdFromUrl = window.Telegram.WebApp.initDataUnsafe?.user?.id;
        if (userIdFromUrl) {
            userIdFromUrl = userIdFromUrl.toString();
            console.log("User ID from mini app:", userIdFromUrl);
        } else {
            const queryParams = new URLSearchParams(window.location.search);
            userIdFromUrl = queryParams.get('userId');
            console.log("User ID from url:", userIdFromUrl);
        }
        setSelectedUser(userIdFromUrl);
        fetchMessages(userIdFromUrl);
    }, []);

    return (
        <div className="app-container">
            <div className="app-wrapper">
                <div className="content-container">
                    <Chat
                        messages={messages}
                        message={message}
                        updateMessages={updateMessages}
                        setMessage={setMessage}
                        selectedUser={selectedUser}
                        handleKeyDown={handleKeyDown}
                        sendMessage={sendMessage}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
