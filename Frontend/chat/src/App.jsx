import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from './Pages/Login';
import { useDispatch, useSelector } from "react-redux";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import useGetCurrent from "./Hooks/getCurrent";
import useGetOtherusers from "./Hooks/getOtherusers";
import {io} from "socket.io-client"
import { useEffect } from "react";
import { serverUrl } from "./main";
import { setOnlineusers, setSocket } from "./redux/userslice";
function App() {
  let { userdata ,socket,onlineUsers} = useSelector(state => state.user);
  let dispatch=useDispatch();

  useGetCurrent();
  useGetOtherusers();

 useEffect(() => {

  if (userdata) {

    const socketio = io(`${serverUrl}`, {
      query: {
        userId: userdata._id
      }
    });

    dispatch(setSocket(socketio));

    socketio.on("getOnlineUsers", (userss) => {
      dispatch(setOnlineusers(userss));
    });

    return () => socketio.close();

  } else {

    if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }

  }

}, [userdata]);

  return (
    <div>
      <Routes>
        <Route path="/signup" element={!userdata ? <Signup /> : <Navigate to={'/profile'} />} />
        <Route path="/login" element={!userdata ? <Login /> : <Navigate to={'/'} />} />
        <Route path="/" element={userdata ? <Home /> : <Navigate to={'/login'} />} />
        <Route path="/profile" element={userdata ? <Profile /> : <Navigate to={'/signup'} />} />
      </Routes>
    </div>
  );
}

export default App;