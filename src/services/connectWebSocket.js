const connectWebSocket = (url, handleNewMessage) => {
  const socket = new WebSocket(url);

  socket.addEventListener("message", (event) => {
    try {
      const message = event.data;
      handleNewMessage(message);
    } catch (error) {
      // handleMessage(event);
      console.log(error.message);
    }
  });

  return socket;
};

export default connectWebSocket;
