import React, { useState } from 'react'
import Client from './Client'
import Editor from './Editor'

const EditorPage = () => {
  const [client,setClient] = useState([
    {socket:1,username:"Vishwajeet"},
    {socket:2,username:"Aman"},
    {socket:3,username:"Bingo and"}
  ])
  return (
    <div className='main_wrapper'>
      <div className='aside'>
        <div className='aside_inner'>
          <div className='logo'>
            <img className='logo_img' src="/mylogo.png" alt="" width={'60px'}/>
          </div>
          <h3>Connected</h3>
          <div className='clients_list'>
            {
              client.map((ele)=>{
                return <Client key={ele.socket} client={ele.username}/>
              })
            }
          </div>
        </div>
        <button className='btn copy_btn'>Copy Room ID</button>
        <button className='btn leave_btn'>Leave</button>
      </div>
      <div className='editor_wrap'>
        <Editor/>
      </div>
    </div>
  )
}

export default EditorPage

