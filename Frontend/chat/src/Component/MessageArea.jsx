import React, { useEffect, useRef, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import dp from "../assets/dp.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setSelecteduser } from "../redux/userslice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoImagesOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../main";
import { setusermessage } from "../redux/messageSlice";
import useGetMessages from "../Hooks/getMessage";

function MessageArea() {
  let { selecteduser, userdata, socket } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  let { message } = useSelector((state) => state.message);

  useGetMessages();

  let [showpicker, setshowpicker] = useState(false);
  let [input, setinput] = useState("");
  let [frontendImage, setfrontendImage] = useState(null);
  let [backendImage, setbackendImage] = useState(null);

  let image = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const changeEmoji = (emojidata) => {
    setinput((pre) => pre + emojidata.emoji);
    setshowpicker(false);
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      setbackendImage(file);
      setfrontendImage(URL.createObjectURL(file));
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !backendImage) return;

    try {
      let formdata = new FormData();
      formdata.append("message", input);
      if (backendImage) {
        formdata.append("image", backendImage);
      }

      let result = await axios.post(
        `${serverUrl}/api/message/send/${selecteduser._id}`,
        formdata,
        { withCredentials: true }
      );

      dispatch(setusermessage([...message, result.data]));
      setinput("");
      setfrontendImage(null);
      setbackendImage(null);
    } catch (error) {
      console.log("Error sending message:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (mess) => {
        dispatch(setusermessage([...message, mess]));
      });
      return () => socket.off("newMessage");
    }
  }, [message, socket, dispatch]);

  return (
    <div
      className={`lg:w-[70%] w-full h-full bg-slate-200 ${
        selecteduser ? "flex" : "hidden"
      } lg:flex border-l-2 border-gray-300 relative`}
    >
      {selecteduser && (
        <div className="w-full h-screen flex flex-col">
          {/* Header */}
          <div className="w-full h-[80px] md:h-[100px] bg-red-400 rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center px-4 md:px-[20px] gap-2 md:gap-[20px] flex-shrink-0">
            <div className="cursor-pointer">
              <IoArrowBackSharp
                className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
                onClick={() => dispatch(setSelecteduser(null))}
              />
            </div>
            <div className="w-[45px] h-[45px] md:w-[65px] md:h-[65px] rounded-full overflow-hidden shadow-lg">
              <img
                src={selecteduser?.image || dp}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-semibold text-lg md:text-[20px] truncate">
              {selecteduser?.name || selecteduser?.username || "User"}
            </h1>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto pt-4 md:pt-[30px] pb-28 px-3 md:px-[50px] relative">
            {showpicker && (
              <div className="absolute bottom-0 left-4 md:left-[20px] z-10">
                <EmojiPicker
                  width={250}
                  height={350}
                  theme="dark"
                  className="shadow-lg"
                  onEmojiClick={changeEmoji}
                  emojiStyle="google"
                />
              </div>
            )}

            <div className="flex flex-col gap-3 md:gap-[20px]">
              {message && message.length > 0 ? (
                message.map((mess, index) => {
                  const isSender =
                    mess.sender?._id === userdata?._id ||
                    mess.sender === userdata?._id;
                  return isSender ? (
                    <SenderMessage
                      key={mess._id || index}
                      image={mess.image}
                      message={mess.message}
                    />
                  ) : (
                    <ReceiverMessage
                      key={mess._id || index}
                      image={mess.image}
                      message={mess.message}
                    />
                  );
                })
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                  No messages yet. Start a conversation!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}

      {!selecteduser && (
        <div className="w-full h-full flex flex-col justify-center items-center px-4">
          <h1 className="text-gray-700 font-bold text-3xl md:text-[50px] text-center">
            Welcome to Chat-Z
          </h1>
          <span className="text-gray-800 font-semibold py-7 text-2xl md:text-[50px] text-center">
            Friendly Chat...
          </span>
        </div>
      )}

      {/* Input Form */}
      {selecteduser && (
        <div className="w-full absolute bottom-0 left-0 p-4 bg-gradient-to-t from-slate-200 via-slate-200 to-transparent">
          {/* Image Preview */}
          {frontendImage && (
            <div className="absolute bottom-24 right-4 md:right-8 z-50">
              <div className="relative">
                <img
                  src={frontendImage}
                  alt="preview"
                  className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] object-cover rounded-lg shadow-lg border-2 border-white"
                />
                <button
                  onClick={() => {
                    setfrontendImage(null);
                    setbackendImage(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <form
            className="w-full max-w-4xl mx-auto h-[55px] md:h-[60px] bg-red-400 shadow-gray-400 shadow-lg rounded-full flex items-center gap-2 px-3"
            onSubmit={handleMessageSubmit}
          >
            <button type="button" className="flex-shrink-0">
              <RiEmojiStickerLine
                className="w-5 h-5 md:w-6 md:h-6 text-black cursor-pointer"
                onClick={() => setshowpicker((pre) => !pre)}
              />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={image}
              hidden
              onChange={handleImage}
            />

            <input
              type="text"
              className="flex-1 min-w-0 h-full px-2 outline-none border-0 text-sm md:text-base text-black bg-transparent placeholder-black/70"
              placeholder="Type a message..."
              onChange={(e) => setinput(e.target.value)}
              value={input}
            />

            <button
              type="button"
              onClick={() => image.current.click()}
              className="flex-shrink-0"
            >
              <IoImagesOutline className="w-5 h-5 md:w-6 md:h-6 text-black cursor-pointer" />
            </button>

            <button
              type="submit"
              disabled={!input.trim() && !backendImage}
              className="flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BsSend className="w-5 h-5 md:w-6 md:h-6 text-black cursor-pointer" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MessageArea;