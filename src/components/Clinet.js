import React from 'react'
import Avatar from 'react-avatar'

const Clinet = ({username}) => {
  return (
    <div className='client'>
        <Avatar name={username} size={50} round='14px'/>
        <span className='username'>{username}</span>
    </div>
  )
}

export default Clinet