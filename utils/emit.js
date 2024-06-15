// Function to broadcast Socket.IO messages
const broadcastSocketIoMessage = (io, header, body) => {
    io.emit(header, body);
};

const broadcast = {
  broadcastSocketIoMessage
}

export default broadcast;