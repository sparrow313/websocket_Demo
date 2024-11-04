import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [latestMessage, setLatestMessages] = useState("");
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("room1"); // Default room value

  useEffect(() => {
    const newSocket = new WebSocket(`ws://localhost:8080/?room=${room}`);
    newSocket.onopen = () => {
      console.log(`Connected to room: ${room}`);
      newSocket.send(`Hello from client in ${room}`);
      setSocket(newSocket);
    };
    newSocket.onmessage = (message) => {
      console.log("Message received:", message);
      setLatestMessages(message.data);
    };
    return () => newSocket.close();
  }, [room]); // Re-run this effect if the room changes

  if (!socket) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <div>
        <label>
          Room:
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </label>
        <input
          type="text"
          placeholder="Message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={() => {
            socket.send(message);
          }}
        >
          SEND
        </button>
      </div>
      <div style={{ color: "white" }}>{latestMessage}</div>
    </>
  );
}

export default App;

// import { useEffect, useState } from "react";
// import "./App.css";

// function App() {
//   const [socket, setSocket] = useState<WebSocket | null>(null);
//   const [latestMessage, setLatestMessages] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const newSocket = new WebSocket("ws://localhost:8080");
//     newSocket.onopen = () => {
//       console.log("Connection established");
//       newSocket.send("Hello Server!");
//       setSocket(newSocket);
//     };
//     newSocket.onmessage = (message) => {
//       console.log("Message received:", message);
//       setLatestMessages(message.data);
//     };
//     return () => newSocket.close();
//   }, []);

//   if (!socket) {
//     return <div>Loading....</div>;
//   }

//   return (
//     <>
//       <div>
//         <input
//           type="text"
//           onChange={(e) => {
//             setMessage(e.target.value);
//           }}
//         />
//         <button
//           onClick={() => {
//             socket.send(message);
//           }}
//         >
//           SEND
//         </button>
//       </div>
//       <div style={{ color: "white" }}>{latestMessage}</div>
//     </>
//   );
// }

// export default App;
