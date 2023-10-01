const express =require('express')
const app=express();
const {Server}=require('socket.io')
const http=require('http');
const ACTIONS = require('./src/Actions');
const path = require('path');


const server =http.createServer(app);
const io=new Server(server);

app.use(express.static('build'));
app.use((req,res, next)=>{
    res.sendFile(path.join(__dirname,'build','index.html'));
})


const userSocketMap={};
function getAllConnectedClinet(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return{
            socketId,
            username:userSocketMap[socketId],
        }
    });
}
io.on('connection',(socket)=>{
    console.log('socket connected ',socket.id);

    socket.on(ACTIONS.JOIN,({roomId,username})=>{
        
        userSocketMap[socket.id]=username; 
        socket.join(roomId);
        const client=getAllConnectedClinet(roomId);
        // console.log(client);
        client.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                client,
                username,
                socketId:socket.id,

            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE,({roomId, code})=>{
        // console.log('rec ',code);
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code});
    })

    socket.on(ACTIONS.SYNC_CODE,({socketId, code})=>{
        // console.log('rec ',code);
        io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code});
    })

    socket.on('disconnecting',()=>{
        const rooms= [...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId :socket.id,
                username: userSocketMap[socket.id],
            })
        })

        delete userSocketMap[socket.id];
        socket.leave();
    })
});


const PORT=process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log("server active")
})

