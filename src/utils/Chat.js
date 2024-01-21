import {formatTimestamp} from '../utils';
import {useEffect, useRef} from "react";

const Chat = ({messages, message, setMessage, handleKeyDown, sendMessage}) => {
    useEffect(() => {
        if (window.Telegram.WebApp.initDataUnsafe?.user) {
            require('./chat-mini-app.css'); // Mini-app styles for Chat component
        } else {
            require('./chat-web-browser.css'); // Web-browser styles for Chat component
        }
    }, []);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };
    useEffect(() => {
        scrollToBottom(); // Call this function whenever messages change
    }, [messages]);
    return (
        <div className="chat-container">
            <div className="message-list">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-item ${msg.role === 'server' ? 'server-message' : 'client-message'}`}>
                        <div className="message-text">{msg.text}</div>
                        <div className="message-timestamp">{formatTimestamp(msg.timestamp)}</div>
                    </div>
                ))}
                <div ref={messagesEndRef}/>
            </div>
            <div className="input-container">
                <input
                    className="message-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                />
                <button className="send-button" onClick={() => sendMessage(message)}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
