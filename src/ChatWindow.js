import { React, useState } from "react";
import "./ChatWindow.css";

function ChatWindow({ handleClose, isActive }) {
  const [messages, setMessages] = useState([
    {
      id: 0,
      sender: "chatbot",
      text: "Hello! What can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Function for sending a new message
  const sendMessage = (event) => {
    if (newMessage != "") {
      event.preventDefault(); // Prevent the reload of the page
      setMessages([
        ...messages,
        {
          id: messages.length,
          sender: "user",
          text: newMessage,
          timestamp: new Date(),
        },
      ]);
      /* The part for sending the message list to the backend */
      setNewMessage("");
    }
  };

  const handleCloseWindow = () => {
    handleClose();
    /*
    setMessages([
      {
        id: 0,
        sender: "chatbot",
        text: "Hello! What can I help you today?",
        timestamp: new Date(),
      },
    ]); // Clear all the messages
    */
  };

  return (
    <div className={isActive ? "chat-window" : "chat-window active"}>
      <div className="chat-header">Chat Support</div>
      <div className="chat-content">
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className={`message ${
                message.sender === "user" ? "user-message" : "chatbot-message"
              }`}
            >
              {message.text}
            </div>
          );
        })}
      </div>
      <div className="chat-input-container">
        <form className="chat-input-bar" onSubmit={sendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(event) => {
              setNewMessage(event.target.value);
            }}
          />
          <button type="submit" className="send-button">
            <svg
              class="send-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
          </button>
        </form>
      </div>
      <button
        className="close-button"
        onClick={handleCloseWindow}
        title="Close"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}

export default ChatWindow;
