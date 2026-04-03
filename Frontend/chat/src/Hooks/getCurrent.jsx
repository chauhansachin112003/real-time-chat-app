import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setuserdata } from "../redux/userslice";

const useGetCurrent = () => {
  let dispatch = useDispatch();
  let { userdata } = useSelector(state => state.user);
  
  useEffect(() => {
    const fetchuser = async () => {
      try {
        let result = await axios.get(
          `${serverUrl}/api/user/current`,
          { withCredentials: true }
        );
        dispatch(setuserdata(result.data));
      } catch (error) {
        console.log("Error fetching current user:", error.response?.data || error.message);
      }
    };
    
    if (!userdata) {
      fetchuser();
    }
  }, [dispatch, userdata]);
};

export default useGetCurrent;