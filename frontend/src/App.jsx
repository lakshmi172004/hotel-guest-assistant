import { useState, useRef } from "react";
import AvailabilityForm from "./components/AvailabilityForm";

function App() {

    // Create a unique ID for this conversation
    const conversationId = useRef(crypto.randomUUID()).current;

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "assistant",
            text: "Hello! 👋 Welcome to Grand Horizon Hotel. How can I help you today?"
        }
    ]);

    const [loading, setLoading] = useState(false);


    // Send message to backend
    async function handleSend() {

        // Do not send empty messages
        if (message.trim() === "" || loading) {
            return;
        }

        const userMessage = message;

        // Add user's message to chat
        setMessages((previousMessages) => [
            ...previousMessages,
            {
                sender: "user",
                text: userMessage
            }
        ]);

        // Clear input box
        setMessage("");

        // Show loading
        setLoading(true);

        try {

           const response = await fetch(
    "https://hotel-guest-assistant-ygch.onrender.com/api/chat",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: userMessage,
            conversationId: conversationId
        })
    }
);


            // Check backend response
            if (!response.ok) {

                throw new Error(
                    `Backend returned status ${response.status}`
                );

            }


            const data = await response.json();


            // Add assistant response
            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    sender: "assistant",
                    text: data.answer
                }
            ]);

        } catch (error) {

            console.error("Chat error:", error);

            // Display friendly error
            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    sender: "assistant",
                    text: "Sorry, I'm unable to connect to the hotel assistant right now. Please try again."
                }
            ]);

        } finally {

            setLoading(false);

        }
    }


    return (
        <div className="app">

            <div className="chat-container">


                {/* Header */}

                <header className="chat-header">

                    <h1>
                        Grand Horizon Hotel
                    </h1>

                    <p>
                        Hotel Guest Assistant
                    </p>

                </header>



                {/* Chat messages */}

                <div className="chat-messages">

                    {messages.map((msg, index) => (

                        <div
                            key={index}
                            className={`message ${
                                msg.sender === "user"
                                    ? "user-message"
                                    : "assistant-message"
                            }`}
                        >

                            <div className="message-label">

                                {msg.sender === "user"
                                    ? "You"
                                    : "Assistant"}

                            </div>

                            <div className="message-bubble">

                                {msg.text}

                            </div>

                        </div>

                    ))}


                    {/* Loading message */}

                    {loading && (

                        <div className="message assistant-message">

                            <div className="message-label">
                                Assistant
                            </div>

                            <div className="message-bubble">
                                Thinking...
                            </div>

                        </div>

                    )}

                </div>



                {/* Availability form */}

                <AvailabilityForm />



                {/* Chat input */}

                <div className="chat-input-area">

                    <input
                        type="text"
                        value={message}
                        onChange={(event) =>
                            setMessage(event.target.value)
                        }
                        onKeyDown={(event) => {

                            if (event.key === "Enter") {
                                handleSend();
                            }

                        }}
                        placeholder="Ask something about the hotel..."
                        disabled={loading}
                    />


                    <button
                        onClick={handleSend}
                        disabled={loading}
                    >

                        {loading
                            ? "Sending..."
                            : "Send"}

                    </button>

                </div>

            </div>

        </div>
    );
}

export default App;