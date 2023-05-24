import React, { useEffect } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'

const Editor = () => {
    //to display code editor
    useEffect(()=>{
        async function init(){
            Codemirror.fromTextArea(document.getElementById('real_time_editor'),{
                mode:{name:'javascript',json:true},
                theme:'dracula',
                autoCloseTags:true,
                autoCloseBrackets:true,
                lineNumbers:true,
            });
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
