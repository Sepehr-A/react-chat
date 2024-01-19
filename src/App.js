import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import AppRoutes from './Routes/AppRoutes';
import {NavLink} from './utils';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const location = useLocation();

    const sendMessage = (messageText) => {
        if (!messageText.trim()) return;

        const messageData = {
            user_id: selectedUser,
            text: messageText,
            timestamp: new Date().toISOString()
        };
        console.log(JSON.stringify(messageData))

        fetch('http://localhost:5000/api/sendMessage', {
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
        fetch(`http://localhost:5000/api/messages?userId=${userId}`)
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

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const userIdFromUrl = queryParams.get('userId');
        if (userIdFromUrl) {
            setSelectedUser(userIdFromUrl);
            fetchMessages(userIdFromUrl);
        }
    }, []);

    return (
        <div className="app-container">
            <div className="app-wrapper">
                <nav className="navbar">
                    <NavLink to="/" currentPath={location.pathname}>
                        Chat
                    </NavLink>
                </nav>
                <div className="content-container">
                    {/*{serverError && <div className="error-message">{serverError}</div>}*/}
                    <AppRoutes
                        messages={messages}
                        message={message}
                        updateMessages={updateMessages}
                        setMessage={setMessage}
                        selectedUser={selectedUser}
                        handleKeyDown={handleKeyDown}
                        sendMessage={sendMessage}/>
                </div>
            </div>
        </div>
    );
}

export default App;
