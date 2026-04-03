import React, { useRef, useState } from 'react';
import { FaCamera } from "react-icons/fa";
import dp from "../assets/dp.jpg";
import { useDispatch, useSelector } from 'react-redux';
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router';
import axios from "axios";
import { serverUrl } from '../main';
import { setuserdata } from '../redux/userslice';

function Profile() {
  let { userdata } = useSelector(state => state.user);
  const navigate = useNavigate();
  let dispatch = useDispatch();
  
  let [name, setname] = useState(userdata?.name || "");
  let [frontendImage, setfrontendImage] = useState(userdata?.image || dp);
  let [backendImage, setbackendImage] = useState(null);
  let [saving, setsaving] = useState(false);

  let image = useRef();

  let handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setbackendImage(file);
      setfrontendImage(URL.createObjectURL(file));
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setsaving(true);
    try {
      let formData = new FormData();
      formData.append("name", name);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      let result = await axios.post(
        `${serverUrl}/api/user/upload`, 
        formData, 
        { withCredentials: true }
      );
      
      dispatch(setuserdata(result.data));
      navigate('/');
    } catch (error) {
      console.log(error);
    } finally {
      setsaving(false);
    }
  };

  if (!userdata) return null;

  return (
    <div className='w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center gap-5'>
      <div className='fixed top-10 left-10 cursor-pointer'>
        <IoArrowBackSharp className='w-[50px] h-[50px]' onClick={() => navigate('/')} />
      </div>
      
      <div 
        className='bg-white rounded-full border-4 border-red-500 shadow-gray-500 shadow-lg relative cursor-pointer' 
        onClick={() => image.current.click()}
      >
        <div className='w-[200px] h-[200px] rounded-full overflow-hidden flex justify-center items-center'>
          <img src={frontendImage} alt='' className='h-[200px] w-[200px] object-cover' />
        </div>
        <div className='absolute bottom-8 right-4 w-[35px] h-[35px] text-gray-900 bg-red-400 rounded-full flex justify-center items-center shadow-gray-400 shadow-lg'>
          <FaCamera className='w-[25px] h-[25px] text-gray-900' />
        </div>
      </div>

      <form className='w-[95%] max-w-[500px] flex flex-col gap-[20px] items-center justify-center' onSubmit={handleProfile}>
        <input 
          type='file' 
          accept='image/*' 
          hidden 
          ref={image} 
          onChange={handleImage}
        />

        <input 
          placeholder='Enter your name..'
          type='text' 
          className='w-[90%] h-[60px] outline-none border-2 border-red-400 px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400 shadow-lg' 
          onChange={(e) => setname(e.target.value)} 
          value={name}
        />

        <input 
          type='email' 
          readOnly 
          className='w-[90%] h-[60px] outline-none border-2 border-red-400 px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400 shadow-lg text-gray-500' 
          value={userdata?.email}
        />

        <input 
          type='text' 
          readOnly 
          className='w-[90%] h-[60px] outline-none border-2 border-red-400 px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400 shadow-lg text-gray-500' 
          value={userdata?.username}
        />

        <button 
          type="submit"
          className='px-[20px] py-[10px] bg-green-300 rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner disabled:opacity-50' 
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;