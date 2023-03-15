import React, { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import ACTIONS from "../../Actions";
import toast from 'react-hot-toast';
import logo from "../../Assets/logo.png"
import Client from "../../Components/Client";
import Editor from "../../Components/Editor";
import { useSocket } from "../../Context/SocketProvider";

const EditorPage = () => {
    const {initSocket} = useSocket();
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const {roomid} = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
           socketRef.current.on('connect_error', (err) => handleErrors(err));
           socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomid,
                username: location.state?.username
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    },[initSocket, location.state?.username, reactNavigator, roomid])



    const copyroomid = () => {
        try {
            navigator.clipboard.writeText(roomid);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }


    if (!location.state) {
        return <Navigate to="/" />;
    }


  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <div className="EditorPageLogo">
              <img src={logo} alt="code-com-logo" />
              <div>
                <p className="project-title">CodeCom</p>
                <p className="moto">Realtime Collaborator</p>
              </div>
            </div>
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

        <button className="btn copyBtn" onClick={copyroomid}>
          Copy ROOM ID
        </button>

        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">

        <Editor
            socketRef={socketRef}
            roomid={roomid}
            onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
