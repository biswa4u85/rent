import { Server } from "socket.io";
import prisma from "@/libs/prisma";
const resource = "chat";

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    socketMessages(res.socket.server.io)
  } else {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    socketMessages(io)
  }
  res.end();
};

const socketMessages = (socket: any) => {

  socket.on("connection", (client: any) => {
    console.log('A user connected');

    // Join Group
    client.on("join", (room: any) => {
      client.join(room);
    })

    // Leave Group
    client.on("leave", (room: any) => {
      client.leave(room);
    })

    // Group Chat
    client.on('sendMessage', async ({ room, message }: any) => {
      // Save the Message to MongoDB
      await prisma[resource].create({ data: { text: message.text, itemId: message.itemId, to: message.toId, from: message.user._id } });
      socket.to(room).emit('sendMessage', message);
    });

    // Disconnect
    client.on('disconnect', () => {
      console.log('A user disconnected');
    });

  });
}

export default SocketHandler;
