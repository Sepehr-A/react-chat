import {useState, useEffect} from 'react';
import Chat from './utils/Chat';
import SERVER_URL from './utils/config';

function App() {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');

    const sendMessage = (messageText) => {
        if (!messageText.trim()) return;

        // Prepare the message data
        const messageData = {
            user_id: selectedUser,
            text: messageText,
            timestamp: new Date().toISOString(),
            role: 'client' // Adding role here for immediate UI update
        };

        // Clear the input immediately
        setMessage('');

        // Optimistically update the UI with the user's message
        setMessages(prevMessages => [...prevMessages, messageData]);

        // Send the message to the server
        fetch(`${SERVER_URL}/api/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        })
            .then(response => {
                if (!response.ok) {
                    // Handle non-2xx responses here
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Assuming data.gptReply contains the reply message
                if (data.success) {
                    // Update messages state with the server's reply (GPT reply)
                    setMessages(prevMessages => [
                        ...prevMessages.filter(msg => msg.timestamp !== messageData.timestamp), // Remove optimistic message
                        messageData, // Re-add it to maintain order in case server modified it
                        {text: data.gptReply, role: 'server', timestamp: new Date().toISOString()}
                    ]);
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
                // Optionally handle the failed message here (e.g., by removing the optimistic message)
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

     useEffect(() => {
        if (window.Telegram.WebApp.initDataUnsafe?.user) {
            require('./utils/app-mini-app.css'); // Dynamically load mini-app styles
        } else {
            require('./utils/app-web-browser.css'); // Dynamically load web-browser styles
        }
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage(message);
            setMessage('');
        }
    };
    // todo show user message as soon as they hit enter not with the answer
    useEffect(() => {
        let userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;

        if (window.Telegram && window.Telegram.WebApp && userId) {
            window.Telegram.WebApp.expand();
            const initData = window.Telegram.WebApp.initData;
            if (initData) {
                const decodedData = decodeURIComponent(initData);
                const parsedData = new URLSearchParams(decodedData);

                const userData = parsedData.get('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    userId = user.id.toString();
                    console.log("User ID from Telegram Mini App:", userId);
                }
            }
        } else {
            // Fallback to URL query param if not in Telegram Mini App context
            const queryParams = new URLSearchParams(window.location.search);
            userId = queryParams.get('userId');
            console.log("User ID from URL:", userId);
        }

        if (userId) {
            setSelectedUser(userId);
            fetchMessages(userId);
        }
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
