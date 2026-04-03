import { useState, useEffect } from 'react';
import { IoSearch } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { BiLogOutCircle } from "react-icons/bi";
import dp from "../assets/dp.jpg";
import { useNavigate } from 'react-router';
import { serverUrl } from '../main';
import axios from 'axios';
import { setOtherusers, setSelecteduser, setuserdata } from '../redux/userslice';

function Sidebar() {
  let { userdata, otherusers, selecteduser, onlineUsers } = useSelector(state => state.user);
  
  let [search, setsearch] = useState(false);
  let [searchTerm, setSearchTerm] = useState('');
  let [filteredUsers, setFilteredUsers] = useState([]);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    setFilteredUsers(otherusers || []);
  }, [otherusers]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(otherusers || []);
    } else {
      const filtered = (otherusers || []).filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, otherusers]);

  const handlelogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      dispatch(setuserdata(null));
      dispatch(setOtherusers([]));
      dispatch(setSelecteduser(null));
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error.response?.data || error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Check if a user is online (excluding current user)
  const isUserOnline = (userId) => {
    // Don't show online indicator for the logged-in user
    if (userId === userdata?._id) return false;
    return onlineUsers?.includes(userId);
  };

  return (
    <div className={`lg:w-[30%] w-full h-full overflow-hidden bg-slate-200 ${!selecteduser ? "block" : "hidden"} lg:block relative `}>
      <div
        className='w-[55px] h-[55px] bg-red-600 rounded-full
          flex justify-center items-center
          shadow-lg cursor-pointer hover:scale-105 transition fixed bottom-10 left-5 z-10'
        onClick={handlelogout}
      >
        <BiLogOutCircle className='w-[26px] h-[26px] text-white' />
      </div>

      {/* HEADER */}
      <div className='w-full h-[300px] bg-red-500 rounded-b-[60px] shadow-xl flex flex-col justify-center px-[25px] gap-[18px]'>
        {/* APP NAME */}
        <h1 className='text-white text-[22px] font-semibold opacity-80'>
          Chat-Z
        </h1>

        {/* USER INFO */}
        <div className='flex justify-between items-center'>
          <h1 className='text-black text-[22px] font-semibold'>
            Hi, {userdata?.name || userdata?.username || "User"}
          </h1>

          <div 
            className='w-[65px] h-[65px] rounded-full overflow-hidden shadow-lg cursor-pointer' 
            onClick={() => navigate('/profile')}
          >
            <img
              src={userdata?.image || dp}
              alt="profile"
              className='w-full h-full object-cover'
            />
            {/* No online indicator for current user */}
          </div>
        </div>

        {/* SEARCH AREA */}
        <div className='mt-[10px] w-full items-center gap-[20px] flex overflow-y-auto'>
          {/* SEARCH ICON */}
          {!search && (
            <div
              onClick={() => setsearch(true)}
              className='w-[55px] h-[55px] bg-white rounded-full
                flex justify-center items-center
                shadow-lg cursor-pointer hover:scale-105 transition'
            >
              <IoSearch className='w-[26px] h-[26px] text-gray-700' />
            </div>
          )}

          {/* SEARCH BAR */}
          {search && (
            <form 
              className='w-full h-[55px] bg-white shadow-lg
                flex items-center gap-[10px]
                rounded-full px-[20px]'
              onSubmit={(e) => e.preventDefault()}
            >
              <IoSearch className='w-[22px] h-[22px]' />
              <input
                type='text'
                placeholder='Search user...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='w-full h-full outline-none border-none bg-transparent'
                autoFocus
              />
              <RxCross1
                className='w-[22px] h-[22px] cursor-pointer'
                onClick={() => {
                  setsearch(false);
                  setSearchTerm('');
                }}
              />
            </form>
          )}

          {/* User thumbnails when not searching - Only show online users */}
          {!search && otherusers
            ?.filter(user => isUserOnline(user._id)) // Only show online users
            .slice(0, 3)
            .map((user) => (
              <div 
                key={user._id} 
                className='relative'
                onClick={() => dispatch(setSelecteduser(user))}
              >
                <div className='w-[65px] h-[65px] rounded-full overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition'>
                  <img
                    src={user.image || dp}
                    alt="profile"
                    className='w-full h-full object-cover'
                  />
                </div>
                {/* Online indicator for thumbnail */}
                <span className='w-3.5 h-3.5 rounded-full absolute bottom-0 right-0 bg-green-500 border-2 border-white'></span>
              </div>
            ))}
        </div>
      </div>

      {/* USERS LIST */}
      <div className='w-full h-[60vh] overflow-auto flex flex-col gap-[20px] items-center mt-[10px] pb-20'>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div 
              key={user._id} 
              className='w-[95%] h-[70px] flex items-center gap-[20px] shadow-gray-500 bg-white shadow-lg rounded-full cursor-pointer hover:scale-105 transition relative'
              onClick={() => dispatch(setSelecteduser(user))}
            >
              <div className='relative'>
                <div className='w-[65px] h-[65px] rounded-full overflow-hidden shadow-lg'>
                  <img
                    src={user.image || dp}
                    alt="profile"
                    className='w-full h-full object-cover'
                  />
                </div>
                {/* WhatsApp-style online indicator - only for other users */}
                {isUserOnline(user._id) && (
                  <span className='w-4 h-4 rounded-full absolute bottom-0 right-0 bg-green-500 border-2 border-white'></span>
                )}
              </div>
              <div className='flex flex-col'>
                <h1 className='font-semibold'>{user.name || user.username}</h1>
                {isUserOnline(user._id) && (
                  <span className='text-xs text-green-600 font-medium'>online</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className='text-gray-500 mt-10'>
            {searchTerm ? 'No users found' : 'No other users'}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;