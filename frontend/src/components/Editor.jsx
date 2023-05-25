import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import ACTIONS from '../action'

const Editor = ({socketRef,roomId}) => {
    //to display code editor
    const editorRef = useRef();
    useEffect(()=>{
        async function init(){
           editorRef.current =  Codemirror.fromTextArea(document.getElementById('real_time_editor'),{
                mode:{name:'javascript',json:true},
                theme:'dracula',
                autoCloseTags:true,
                autoCloseBrackets:true,
                lineNumbers:true,
            });
            editorRef.current.on('change',(instance,changes)=>{
              const {origin}  = changes;
              const code = instance.getValue();
              if(origin !== 'setValue'){
                socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                  roomId,
                  code,
                })
              }
            })
            //getting the code and showing it on ui
            socketRef.current.on('code_change',({code})=>{
              if(code !== null){
                editorRef.current.setValue(code);
              }
            })
        }
        init();
    },[])
  return (
    <div>
      <textarea id='real_time_editor'></textarea>
    </div>
  )
}

export default Editor
