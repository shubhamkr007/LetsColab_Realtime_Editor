import React, { useEffect, useRef, useState } from 'react'
import Clinet from '../components/Clinet';
import Editor from '../components/Editor';
import ACTIONS from '../Actions'
import { initSocket } from '../socket';
import {Navigate, useLocation, useNavigate, useParams} from 'react-router-dom'
import toast from 'react-hot-toast';


const Editorpage = () => {

  const socketRef=useRef(null);
  const codeRef=useRef(null);
  const location= useLocation();
  const reactNavigator=useNavigate();
  const {roomId} = useParams();
  const [client, setClinet]=useState([]);
  // console.log(roomId);

  useEffect(()=>{
    const init=async ()=>{
      socketRef.current=await initSocket();
      socketRef.current.on('connect_error', (err)=>handleErrors(err));
      socketRef.current.on('connect_failed', (err)=>handleErrors(err));

      function handleErrors(err){
        console.log("socket error ",err);
        toast.error('Socket connection failed, try again later');
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
    });

      socketRef.current.on(ACTIONS.JOINED,({client,username,socketId})=>{
        if(username !== location.state?.username){
          toast.success(`${username} joined the meeting`);
          console.log(`${username} joined the meeting`);
        }
        setClinet(client);

        socketRef.current.emit(ACTIONS.SYNC_CODE,{
          code : codeRef.current,
          socketId,
        })
      })

      socketRef.current.on(ACTIONS.DISCONNECTED,({socketId, username})=>{
        toast.success(`${username} left the meeting`);
        setClinet((prev)=>{
          return prev.filter(
            (client)=>client.socketId!= socketId
            )
        })
      })

    }

    init();

    return()=>{
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED)
      socketRef.current.off(ACTIONS.DISCONNECTED)
    }
  },[]);

  async function copyRoomId(){
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success('Room Id copied to clipboard');
    }
    catch(err){
      toast.error('could not copy')
      console.error(err);
    }
  }

  function LeaveRoom(){
    reactNavigator('/');
  }



  if(!location.state)
    return <Navigate to='/'/>

  return (
    <div className='mainWrap'>
      <div className='aside'>

          <div className='asideInner'>
            <div className="logo">
              <img className='logoimg' src="/icon.png" alt="logo" />
            </div>

            <h3>Connected</h3>
            <div className="clinetsList">
              {client.map(client=>(<Clinet key={client.socketId} username={client.username} />))}
            </div>
          </div>

        <button className='btn copyBtn' onClick={copyRoomId}>Copy ID</button>
        <button className='btn leaveBtn' onClick={LeaveRoom}>Leave</button>
        
      </div>


      <div className="editorWrap"> 
       <Editor socketRef={socketRef} roomId={roomId} onCodeChange=
       {(code)=>{codeRef.current=code}}/>
       </div>
    </div>
  )
}

export default Editorpage