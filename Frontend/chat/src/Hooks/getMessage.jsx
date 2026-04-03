import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setusermessage } from "../redux/messageSlice";

const useGetMessages = () => {
  let dispatch = useDispatch();
  let { selecteduser } = useSelector(state => state.user);
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selecteduser?._id) return;

      try {
        let result = await axios.get(
          `${serverUrl}/api/message/get/${selecteduser._id}`,
          { withCredentials: true }
        );
        dispatch(setusermessage(result.data));
      } catch (error) {
        console.log("Error fetching messages:", error.response?.data || error.message);
        dispatch(setusermessage([]));
      }
    };

    fetchMessages();
  }, [selecteduser, dispatch]);
};

export default useGetMessages;