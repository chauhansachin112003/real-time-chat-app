import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setOtherusers } from "../redux/userslice";

const useGetOtherusers = () => {
  let dispatch = useDispatch();
  let { userdata } = useSelector(state => state.user);
  
  useEffect(() => {
    const fetchOtherUsers = async () => {
      if (!userdata) return;
      
      try {
        let result = await axios.get(
          `${serverUrl}/api/user/others`,
          { withCredentials: true }
        );
        dispatch(setOtherusers(result.data));
      } catch (error) {
        console.log("Error fetching other users:", error.response?.data || error.message);
        dispatch(setOtherusers([]));
      }
    };

    fetchOtherUsers();
  }, [userdata, dispatch]);
};

export default useGetOtherusers;