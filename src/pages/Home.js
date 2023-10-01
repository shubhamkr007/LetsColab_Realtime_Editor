import React, { useState } from 'react'
import {v4 as uuidv4} from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate= useNavigate();

  const [roomid, setRoomId]=useState('');
  const [username, setUserName]=useState('');

  const createNewRoom =(e)=>{
    e.preventDefault();
    const id=uuidv4();
    setRoomId(id);
    toast.success('Generated a new ID')
    // console.log(id);
  }

  const joinRoom=()=>{
    if(!roomid || !username){
      toast.error('Invitation ID and UserName is required')
      return
    }

    navigate(`/editor/${roomid}`,{
      state:{
        username,
      }
    })
  }

  const handleInputEnter=(e)=>{
    if(e.code === 'Enter')
      joinRoom();
  }


  return (
    <div className='HomePageWrapper'>
      <div className='formWrapper'>
        <img src="/icon.png" alt="logo" className='logohome'/>
        <h4 className='mainLabel'>Paste Your invitaion ID</h4>
        <div className='inputGroup'>
          <input type="text" className='inputBox' placeholder='INVITATION ID'
          onChange={(e)=>setRoomId(e.target.value)}
          value={roomid} 
          onKeyUp={handleInputEnter}/>
          <input type="text" className='inputBox' placeholder='USER NAME' 
            onChange={(e)=>setUserName(e.target.value)}
            value={username} 
            onKeyUp={handleInputEnter}/>
          <button onClick={joinRoom} className='btn joinBtn'>Join</button>
          <span className='createInfo'>
            If you don't have invite then create &nbsp;
            <a onClick={createNewRoom} href="" className='createNewBtn'>new Invite</a>
          </span>
        </div>
      </div>


      <footer>
      <h4>Build by Shubham Kumar</h4>
      </footer>
      
    </div>
  )
}

export default Home