import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../main';
import axios from 'axios';
import { setSelecteduser, setuserdata } from '../redux/userslice';
import { useDispatch } from 'react-redux';

function Login() {
  const navigate = useNavigate();
  const [show, setshow] = useState(false);
  const [email, setemail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [err, seterr] = useState("");

  const dispatch = useDispatch();

  const handlelogin = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, Password },
        { withCredentials: true }
      );
      
      dispatch(setuserdata(result.data));
      dispatch(setSelecteduser(null));
      navigate("/");
      setemail("");
      setPassword("");
      seterr("");
    } catch (error) {
      console.log(error);
      seterr(error.response?.data?.message || "Login failed");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
      <div className='w-full max-w-[500px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]'>
        <div className='w-full h-[200px] bg-yellow-200 rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center'>
          <h1 className='text-white font-bold text-[30px]'>Chat-Z</h1>
        </div>

        <form className='w-full flex flex-col gap-[20px] items-center pb-8' onSubmit={handlelogin}>
          <input 
            type='email' 
            placeholder='Email' 
            className='w-[90%] h-[60px] outline-none border-2 border-red-400 px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400' 
            value={email} 
            onChange={(e) => setemail(e.target.value)}
            required
          />
          
          <div className='w-[90%] h-[60px] border-2 border-red-400 overflow-hidden rounded-lg shadow-gray-400 relative'>
            <input 
              type={show ? 'text' : 'password'} 
              placeholder='Password' 
              className='w-full h-full outline-none px-[20px] py-[10px] bg-white' 
              value={Password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span 
              className='absolute top-[10px] right-[20px] text-[19px] text-blue-400 font-semibold cursor-pointer' 
              onClick={() => setshow(pre => !pre)}
            >
              {show ? 'hide' : 'show'}
            </span>
          </div>
          
          {err && <p className='text-red-600'>{err}</p>}

          <button 
            type="submit"
            className='px-[20px] py-[10px] bg-green-300 rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner disabled:opacity-50' 
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          
          <p className='cursor-pointer' onClick={() => navigate("/signup")}>
            Want to create a new account? <span className='text-blue-400 font-bold'>Sign Up</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;