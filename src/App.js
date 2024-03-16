import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css'
const ENDPOINT = "http://127.0.0.1:4000";
const socket = socketIOClient(ENDPOINT);

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [hasName, setHasName] = useState(false);

  const submitName = () => {
    if (name) {
      socket.emit('set user', name);
      socket.emit('join chat', name);
      setHasName(true);
    }
  };

  const sendMessage = () => {
    if (message && name) {
      const fullMessage = `${name}: ${message}`;
      socket.emit('chat message', fullMessage);
      setMessage('');
    }
  };

  const leaveChat = () => {
    socket.emit('leave chat', name);
    setHasName(false);
    setName('');
    // Reset messages if you want to clear chat on leave
    setMessages([]);
  };

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages(messages => [...messages, msg]);
    });

    return () => socket.off('chat message');
  }, []);

  return (
    <div className="chat-container">
      {hasName ? (
        // Chat interface
        <div className="chat-interface">
          <ul className="message-list">
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
          <div className="message-input">
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
            <button onClick={leaveChat}>Leave Chat</button>
          </div>
        </div>
      ) : (
        // Name submission form
        <div className="name-entry">
        <input
          placeholder="Enter your name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && submitName()}
        />
        <button onClick={submitName}>Enter Chat</button>
      </div>
      )}
    </div>
  );
}

export default App;


