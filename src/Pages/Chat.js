import './Chat.css';
// import {useEffect, useRef} from "react";
import {formatTimestamp} from '../utils';

const Chat = ({messages, message, setMessage, handleKeyDown, sendMessage}) => {
    return (
        <div className="chat-container">
            <div className="message-list">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-item ${msg.role === 'server' ? 'server-message' : 'client-message'}`}>
                        <div>
                            <div className="message-text">{msg.text}</div>
                            <div className="message-timestamp">{formatTimestamp(msg.timestamp)}</div>
                        </div>
                    </div>
                ))}
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
