import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "../../node_modules/codemirror/lib/codemirror.css";
import "../../node_modules/codemirror/theme/dracula.css";
import "../../node_modules/codemirror/mode/javascript/javascript";
import "../../node_modules/codemirror/addon/edit/closetag";
import "../../node_modules/codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";

const Editor = ({socketRef, roomid, onCodeChange}) => {
    const editorRef = useRef(null);
    useEffect(() => {
        const init = () => {
            editorRef.current = CodeMirror.fromTextArea(document.getElementById("realtimeEditor"), {
                mode: { name: "javascript", json: true },
                theme: "dracula",
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
              });

              editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomid,
                        code,
                    });
                }
            });


        }
        init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
        socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
            if (code !== null) {
                editorRef.current.setValue(code);
            }
        });
    }

    return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
}, [socketRef.current]);

  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
