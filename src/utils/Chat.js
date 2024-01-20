import './Chat.css';
import {formatTimestamp} from '../utils';
import {useEffect, useRef} from "react";

const Chat = ({messages, message, setMessage, handleKeyDown, sendMessage}) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]); // Dependency array ensures this effect runs every time messages update

    return (
        <div className="chat-container">
            <div className="message-list">
                {messages.map((msg, index) => (
                    <div key={index}
                         className={`message-item ${msg.role === 'server' ? 'server-message' : 'client-message'}`}>
                        <div className="message-text">{msg.text}</div>
                        <div className="message-timestamp">{formatTimestamp(msg.timestamp)}</div>
                    </div>
                ))}
                <div ref={messagesEndRef}/>
                {/* Invisible element at the end of the messages */}
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
