import React, { useState } from "react";
import { v4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const nav = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = v4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId) {
      return toast.error("RoomId required");
    }
    if (!username) return toast.error("Username required");
    nav(`/editor/${roomId}`,{
      state: {
        username,
      }
    });
  };

  const handleInputEnter = (e)=>{
    console.log('event',e.code)
    if(e.code==='Enter'){
      joinRoom()
    }
  }
  return (
    <div className="homePage_Wrapper">
      <div className="form_wrapper">
        <img src="/mylogo.png" alt="mylogo" width={"50px"} className="logo" />
        <h4 className="main_lable">Paste Invitation Room ID</h4>
        <div className="input_group">
          <input
            type="text"
            className="input_box"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="input_box"
            placeholder="USER NAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <button className="btn join" onClick={joinRoom}>
            Join
          </button>
          <span className="create_info">
            If you don't have an invite then create &nbsp;
            <a
              href="https://chat.openai.com/"
              className="create_new_btn"
              onClick={createNewRoom}
            >
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Buit with love by{" "}
          <a href="https://chat.openai.com/" className="footer_name">
            Vishwajeet Singh
          </a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
