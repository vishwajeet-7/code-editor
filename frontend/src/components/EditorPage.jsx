import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../socket";
import ACTIONS, { SYNC_CODE } from "../action";
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
  const socketRef = useRef();
  const roomId = params.roomID;
  const nav = useNavigate();
  const [client, setClient] = useState([]);
  const codeRef = useRef(null);

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
          setClient(clients);
          //updating the ui of new user with the already written code in the editor
          socketRef.current.emit(ACTIONS.SYNC_CODE, { code: codeRef.current,socketId });
        }
      );
      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClient((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED); //to unsubscribe any socket event
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied");
    } catch (error) {
      toast.error("could not copy room ID");
    }
  };

  const leaveRoom = () => {
    nav("/");
  };
  //console.log(socketRef.current)

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
        <button className="btn copy_btn" onClick={copyRoomId}>
          Copy Room ID
        </button>
        <button className="btn leave_btn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editor_wrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
