import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import ACTIONS from "../action";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  //to display code editor
  const editorRef = useRef(null);

  console.log(socketRef)
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("real_time_editor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
        // console.log(socketRef.current)
      });
    }
    init();
  }, []);

  useEffect(()=>{
    if(socketRef.current){
      socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
        console.log("receiving code")
        if(code !== null){
          editorRef.current.setValue(code);
        }
      })
    }

    return ()=>{
      socketRef.current.off(ACTIONS.CODE_CHANGE)
    }
  },[socketRef.current])
  return (
    <div>
      <textarea id="real_time_editor"></textarea>
    </div>
  );
};

export default Editor;
