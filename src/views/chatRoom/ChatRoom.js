import { useEffect, useState } from "react";
import Loader from "../../compontents/Loader/Loader";
import connectWebSocket from "../../services/connectWebSocket";
import styles from "./ChatRoom.module.css";

const ChatRoom = () => {
  const [wordCounts, setWordCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const socket = connectWebSocket(
      "wss://tso-take-home-chat-room.herokuapp.com",
      handleNewMessage
    );
    setIsLoading(false);

    return () => {
      setIsLoading(true);
      socket.close();
    };
  }, []);

  const handleNewMessage = (message) => {
    const separatorIndex = message.indexOf(":");

    if (separatorIndex !== -1) {
      const name = message.slice(0, separatorIndex).trim();
      const content = message.slice(separatorIndex + 1).trim();

      const count = countWords(content);

      setWordCounts((prevCounts) => {
        const updatedCounts = { ...prevCounts };

        if (name in updatedCounts) {
          // Update the count for existing name
          updatedCounts[name] += count;
        } else {
          // Add a new count for a new name
          updatedCounts[name] = count;
        }

        const sortedCounts = Object.entries(updatedCounts).sort(
          (a, b) => b[1] - a[1]
        );

        const sortedCountsObject = Object.fromEntries(sortedCounts);

        return sortedCountsObject;
      });
    } else {
      console.log("Invalid message format:", message);
    }
  };

  const countWords = (message) => {
    return message.split(" ").length;
  };

  return (
    <div>
      <h1 className={styles.title}>Messages Analytics</h1>
      {!isLoading && Object.keys(wordCounts).length !== 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Word Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(wordCounts).map(([name, count]) => (
              <tr key={name}>
                <td className={styles.name}>{name}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default ChatRoom;
