import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../socket";
import ACTIONS from "../action";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";

const EditorPage = () => {
  //initialising socket event
  const params = useParams();
  const location = useLocation();
  const socketRef = useRef(null);
  const roomId = params.roomID;
  const nav = useNavigate();
  const [client, setClient] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      //to handle connection errors
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later");
        nav("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      //listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} has joined the room`);
            console.log(`${username} joined`);
          }
          setClient(clients)
        }
      );
    };
    init();
  }, []);

  if (!location.state) return <Navigate to={"/"} />;
  return (
    <div className="main_wrapper">
      <div className="aside">
        <div className="aside_inner">
          <div className="logo">
            <img className="logo_img" src="/mylogo.png" alt="" width={"60px"} />
          </div>
          <h3>Connected</h3>
          <div className="clients_list">
            {client.map((ele) => {
              return <Client key={ele.socket} client={ele.username} />;
            })}
          </div>
        </div>
        <button className="btn copy_btn">Copy Room ID</button>
        <button className="btn leave_btn">Leave</button>
      </div>
      <div className="editor_wrap">
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;
