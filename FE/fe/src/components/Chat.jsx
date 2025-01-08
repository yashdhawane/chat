import { useEffect, useState } from 'react';

export default function ChatPage() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [matched, setMatched] = useState(false);
  const [gender, setGender] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/user/gender', {
      method: 'GET',
      headers: {
        "Authorization": `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      if (data.error) {
          console.error('Error:', data.error);
      } else {
          setGender(data.gender);
      }
  })
  .catch((error) => {
      console.error('Error:', error);
  });

    const connectWebSocket = () => {
      const socket = new WebSocket('ws://localhost:3000');

      socket.onopen = () => {
        setWs(socket);
        console.log(
          "WebSocket connected, ready to send and receive messages..."
        )
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'matchFound') {
          setMatched(true);
        } else if (data.type === 'message') {
          setMessages((prev) => [...prev, data.text]);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket closed, reconnecting...');
        setTimeout(connectWebSocket, 1000); // Reconnect after 1 second
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        socket.close();
      };
    };

    connectWebSocket();

    return () => {
      ws?.close();
    };
  }, []);

  const handleMatch = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'joinQueue', gender })); // Change gender dynamically
    } else {
      console.error('WebSocket is not open');
    }
  };

  const sendMessage = (text) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'message', text }));
    } else {
      console.error('WebSocket is not open');
    }
  };

  return (
    <div>
      {!matched ? (
        <>
        <button onClick={handleMatch}>Find Match</button>
        <h2>{gender}</h2>
        </>
      ) : (
        <div>
          <h3>Chat Started</h3>
          
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
          <input type="text" onKeyDown={(e) => e.key === 'Enter' && sendMessage(e.currentTarget.value)} />
        </div>
      )}
    </div>
  );
}