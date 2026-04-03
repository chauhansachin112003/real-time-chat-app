import React from 'react';
import Sidebar from '../Component/Sidebar';
import MessageArea from '../Component/MessageArea';

function Home() {
  return (
    <div className='w-full h-[100vh] flex'>
      <Sidebar />
      <MessageArea />
    </div>
  );
}

export default Home;