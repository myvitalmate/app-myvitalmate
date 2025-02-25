import {useState} from 'react';

interface ChatPageProps {
    // Define any props here if needed in the future
}

// const BASE_URL = 'http://127.0.0.1:8000';
const BASE_URL = 'http://localhost:8080';

export const sendMessage = async (message: string, model: string) => {
    const response = await fetch(`${BASE_URL}/chat/message/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message,
            model: model
        }),
    });

    const data = await response.json();
    return data.message;
};

const ChatPage: React.FC<ChatPageProps> = () => {
    const [userInput, setUserInput] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('llama');  // Default model is 'llama'
    const [history, setHistory] = useState<string[]>([]); // Array of history entries stored in state

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(e.target.value);
    };

    const handleSend = async () => {
        if (userInput.trim()) {
            console.log("Sending:", userInput, "Using model:", selectedModel);

            setHistory((prevHistoryEntry) => [...prevHistoryEntry, `User: ${userInput}`]);

            let answer = await sendMessage(userInput, selectedModel)

            setHistory((prevHistoryEntry) => [...prevHistoryEntry, `Bot: ${answer}`]);

            setUserInput('');
        }
    };

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModel(e.target.value);
    };

    return (
        <div>
            {/* Scrollable container for answers */}
            <div style={{height: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px'}}>
                {history.map((historyEntry, index) => (
                    <div key={index}>{historyEntry}</div>
                ))}
            </div>

            {/* User input field */}
            <div style={{marginTop: '10px'}}>
        <textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type your message"
            rows={3}
            style={{width: '100%'}}
        />
            </div>

            {/* Send button */}
            <div style={{marginTop: '10px'}}>
                <button onClick={handleSend}>Send</button>
            </div>

            {/* model dropdown */}
            <select
                value={selectedModel}
                onChange={handleModelChange}
                style={{marginLeft: '10px', padding: '5px'}}
            >
                <option value="gpt">GPT</option>
                <option value="llama">Llama</option>
            </select>
        </div>
    );
};

export default ChatPage;
