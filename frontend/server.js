const express = require('express')
const http = require('http')
const app = express();
const {Server} = require('socket.io');
const ACTIONS = require('./src/action');
const path = require('path');

const server = http.createServer(app)
const io = new Server(server);

app.use(express.static('build'));

app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'build','index.html'))
})

//to know which socket id belongs to which user
const userSocketMap = {};

const getAllConnectedClients = (roomId)=>{
    //it is containg map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            username:userSocketMap[socketId]
        }
    });
}

io.on('connection',(socket)=>{
    socket.on(ACTIONS.JOIN,({roomId,username})=>{ //getting the room id and name of client who wants to join using Action Join
        userSocketMap[socket.id] = username; //storing user inside map
        socket.join(roomId); //joining the room of a particular id
        const clients = getAllConnectedClients(roomId); //list of all clients in the room
        clients.forEach(({socketId})=>{
            //notifying connected clients about the new joined client
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                username, // name of user who has joined
                socketId:socket.id, 
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code}); //send the code to all other clients except the one typing
    })
    //to sync already written codes with the new client
    socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code}); 
    })

    //if user get's disconned while using the page
socket.on('disconnecting',()=>{
    const rooms = [...socket.rooms]; //getting all rooms 
    //notifying each room that the provided socket id is getting disconnected
    rooms.forEach((roomId)=>{
        socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
            socketId: socket.id,
            username:userSocketMap[socket.id],
        })
    })
    delete userSocketMap[socket.id]; //removing the user from map
    socket.leave(); //method to get out of a room officially
})

});

const PORT = process.env.PORT || 5000;

server.listen(PORT,()=> console.log(`listening on port ${PORT}`))