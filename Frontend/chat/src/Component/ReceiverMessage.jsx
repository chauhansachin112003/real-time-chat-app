import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import dp from "../assets/dp.jpg";

function ReceiverMessage({ image, message }) {
  let scroll = useRef();
  let { selecteduser } = useSelector(state => state.user);
  
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const handlescroll = () => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className='flex items-start gap-2 w-full'>
      <div className='w-[35px] h-[35px] md:w-[45px] md:h-[45px] rounded-full overflow-hidden shadow-lg cursor-pointer flex-shrink-0'>
        <img
          src={selecteduser?.image || dp}
          alt="profile"
          className='w-full h-full object-cover'
        />
      </div>
      
      <div 
        className='max-w-[70%] md:max-w-[60%] lg:max-w-[500px] px-4 py-2 bg-gray-300 text-black text-base md:text-lg rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-none shadow-lg shadow-gray-400 break-words whitespace-pre-wrap'
        ref={scroll}
      >
        {image && (
          <img 
            src={image} 
            alt='received' 
            className='max-w-full rounded-lg mb-2 max-h-[200px] object-cover' 
            onLoad={handlescroll}
          />
        )}
        {message && (
          <p className='break-words whitespace-pre-wrap overflow-hidden'>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ReceiverMessage;