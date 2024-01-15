import { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [chat, setChat] = useState<string[]>([]);
  const [client, setClient] = useState<MqttClient | null>(null);

  useEffect(() => {
    const mqttClient = mqtt.connect('ws://3.1.96.11::9001', {
      username: 'asfak', 
      password: '111111',
    });
    setClient(mqttClient);

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT Broker!');
      mqttClient.subscribe('chat');
    });

    mqttClient.on('message', (topic, payload) => {
      const newMessage = payload.toString();
      setChat((prevChat) => [...prevChat, newMessage]);
    });

    mqttClient.on('error', (error) => {
      console.error('Connection error:', error);
    });

    mqttClient.on('close', () => {
      console.log('Connection closed');
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  const sendMessage = () => {
    if (client) {
      client.publish('chat', message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">MQTT Chat App</h1>
        <div className="mb-4 h-60 overflow-y-auto border border-gray-300 rounded p-3">
          {chat.map((msg, index) => (
            <p key={index} className="text-gray-600">{msg}</p>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 mr-4 text-gray-700 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-indigo-500"
          />
          <button 
            onClick={sendMessage}
            className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-600 focus:outline-none focus:ring"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
