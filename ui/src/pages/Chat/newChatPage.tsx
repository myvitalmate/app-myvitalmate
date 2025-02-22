'use client'

import {KeyboardEvent, useState} from 'react';
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"

interface ChatPageProps {
    // Define any props here if needed in the future
}

const BASE_URL = 'http://127.0.0.1:8000';

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
    return data.response;
};

interface ChatMessage {
    content: string;
    isUser: boolean;
}

const ChatPage: React.FC<ChatPageProps> = () => {
    const [userInput, setUserInput] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('llama');
    const [history, setHistory] = useState<ChatMessage[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(e.target.value);
    };

    const handleSend = async () => {
        setUserInput('');
        if (userInput.trim()) {
            console.log("Sending:", userInput, "Using model:", selectedModel);

            setHistory((prevHistory) => [...prevHistory, {content: userInput, isUser: true}]);

            let answer = await sendMessage(userInput, selectedModel)

            setHistory((prevHistory) => [...prevHistory, {content: answer, isUser: false}]);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleModelChange = (value: string) => {
        setSelectedModel(value);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Chat with AI</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] w-full pr-4">
                        {history.map((message, index) => (
                            <div key={index} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
                                <span
                                    className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {message.content}
                                </span>
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Textarea
                        value={userInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message"
                        className="w-full"
                    />
                    <div className="flex justify-between w-full">
                        <Button onClick={handleSend}>Send</Button>
                        <Select value={selectedModel} onValueChange={handleModelChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select model"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gpt">GPT</SelectItem>
                                <SelectItem value="llama">Llama</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ChatPage;