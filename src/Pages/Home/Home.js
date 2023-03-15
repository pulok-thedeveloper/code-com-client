import React, { useState } from "react";
import logo from "../../Assets/logo.png";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomid, setroomid] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setroomid(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomid || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }

    // Redirect
    navigate(`/editor/${roomid}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
        joinRoom();
    }
};

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <div className="homePageLogo">
          <img src={logo} alt="code-com-logo" />
          <div>
            <p className="project-title">CodeCom</p>
            <p className="moto">Realtime Collaborator</p>
          </div>
        </div>
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            onChange={(e) => setroomid(e.target.value)}
            value={roomid}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleInputEnter}
          />
          <button className="btn joinBtn" onClick={joinRoom}>Join</button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">
              New room
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
