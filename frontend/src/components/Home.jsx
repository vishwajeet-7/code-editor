import React from 'react'
import {v4} from 'uuid'

const Home = () => {

  const createNewRoom = (e)=>{
    e.preventDefault();
    const id = v4();
    console.log(id)
  }
  return (
    <div className='homePage_Wrapper'>
      <div className='form_wrapper'>
        <img src="/mylogo.png" alt="mylogo" width={'50px'} className='logo'/>
        <h4 className='main_lable'>Paste Invitation Room ID</h4>
        <div className='input_group'>
          <input type="text" className='input_box' placeholder='ROOM ID' />
          <input type="text" className='input_box' placeholder='USER NAME' />
          <button className='btn join'>Join</button>
          <span className='create_info'>
            If you don't have an invite then create &nbsp;
            <a href="" className='create_new_btn' onClick={createNewRoom}>
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>Buit with love by <a href="" className='footer_name'>Vishwajeet Singh</a></h4>
      </footer>
    </div>
  )
}

export default Home
