import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmojiPicker from "emoji-picker-react";
import { connectSocket, onUserCount, getMessages, onMessages, onNewMessage, sendMessage, disconnectSocket } from "../../../services/socket-client";


const GlobalChat = () => {
       const [showEmojiPicker, setShowEmojiPicker] = useState(false);
       const [userOnline, setUserOnline] = useState(0);
       const [messages, setMessages] = useState([]);
       const [input, setInput] = useState("");

       useEffect(() => {
              connectSocket();

              // update online users
              onUserCount((count) => setUserOnline(count));

              // initial old messages
              onMessages((msgs) => setMessages(msgs));

              // new incoming messages
              onNewMessage((msg) => {
                     setMessages((prev) => [...prev, msg]);
              });

              // request old messages once
              getMessages();

              return () => disconnectSocket();
       }, []);

       const handleSendMessage = () => {
              if (input.trim() === "") return;
              sendMessage({ message: input });
              setInput("");
       };

       return (
              <>
                     {/* Large screens: always visible sidebar */}
                     <div className="hidden lg:flex flex-col h-full xl:w-[30%] lg:w-[35%] bg-[#131620] font-display relative">
                            <div className="flex items-center justify-between px-4 py-5">
                                   <h2 className="text-xl font-bold tracking-wide text-white">LIVE CHAT</h2>
                                   <span className="text-yellow-400 text-base font-bold">● {userOnline} ONLINE</span>
                            </div>
                            <div className="w-full h-[80vh] overflow-x-hidden overflow-y-scroll text-white custom-scrollbar">
                                   {messages?.map((message, index) => (
                                          <div key={index} className="flex gap-4 px-3 py-2 items-center">
                                                 <img src={message?.avatar} className="rounded size-8" />
                                                 <p className="font-semibold">{message.text}</p>
                                          </div>
                                   ))}
                            </div>

                            <div className="flex gap-2 absolute w-full px-4 py-6 bottom-0 bg-[#161B2A] items-center">
                                   <div className="flex-1 flex items-center bg-[#0f111a] rounded-xl px-3 py-2 border border-gray-700">
                                          <Input
                                                 className="flex-1 bg-transparent border-none text-gray-300 focus-visible:ring-0 focus-visible:outline-none placeholder-gray-500"
                                                 placeholder="Type a message..."
                                                 value={input}
                                                 onChange={(e) => setInput(e.target.value)}
                                                 onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                          />
                                          {/* Emoji Picker Button */}
                                          <Smile
                                                 className="text-gray-400 hover:text-white cursor-pointer w-5 h-5 ml-2"
                                                 onClick={() => setShowEmojiPicker((prev) => !prev)}
                                          />
                                   </div>
                                   <Button
                                          onClick={handleSendMessage}
                                          variant="ghost"
                                          className="bg-[#EC981A] rounded text-black font-semibold cursor-pointer h-11"
                                   >
                                          Send
                                   </Button>
                                   {/* Emoji Picker */}
                                   {showEmojiPicker && (
                                          <div className="absolute bottom-16 right-4 z-50 bg-[#1a1e29] rounded-md shadow-md">
                                                 <EmojiPicker
                                                        theme="dark"
                                                        onEmojiClick={(emoji) => setInput((prev) => prev + emoji.emoji)}
                                                 />
                                          </div>
                                   )}
                            </div>
                     </div>

                     {/* Small screens: bottom sheet */}
                     <div className="lg:hidden">
                            <Sheet>
                                   <SheetTrigger className="fixed bottom-4 right-4 bg-[#EC981A] p-3 rounded-full shadow-lg z-50">
                                          <MessageSquare size={24} className="text-black" />
                                   </SheetTrigger>
                                   <SheetContent
                                          side="bottom"
                                          className="h-[60vh] bg-[#1A1F2B] p-4 flex flex-col"
                                   >
                                          <div className="flex items-center justify-between my-6">
                                                 <h2 className="text-xl font-bold tracking-wide text-white">LIVE CHAT</h2>
                                                 <span className="text-yellow-400 text-base font-bold">● {userOnline} ONLINE</span>
                                          </div>
                                          <div className="w-full overflow-x-hidden overflow-y-scroll text-white custom-scrollbar h-full">
                                                 {messages?.map((message, index) => (
                                                        <div key={index} className="flex gap-4 px-3 py-2 items-center">
                                                               <img src={message?.avatar} className="rounded size-8" />
                                                               <p className="font-semibold">{message.text}</p>
                                                        </div>
                                                 ))}
                                          </div>
                                          <div className="flex items-center bg-[#0f111a] rounded-xl px-3 py-2 border border-gray-700">
                                                 {/* Emoji Picker Button */}
                                                 <Smile
                                                        className="text-gray-400 hover:text-white cursor-pointer w-5 h-5 ml-2"
                                                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                                                 />
                                                 <Input
                                                        className="flex-1 bg-transparent border-none text-gray-300 focus-visible:ring-0 focus-visible:outline-none placeholder-gray-500"
                                                        placeholder="Type a message..."
                                                        value={input}
                                                        onChange={(e) => setInput(e.target.value)}
                                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                                 />
                                                 <button
                                                        onClick={handleSendMessage}
                                                        className="bg-[#EC981A] p-2 rounded text-black font-semibold"
                                                 >
                                                        Send
                                                 </button>
                                          </div>
                                          {/* Emoji Picker */}
                                          {showEmojiPicker && (
                                                 <div className="absolute bottom-14 right-4 z-50 bg-[#1a1e29] rounded-md shadow-md">
                                                        <EmojiPicker
                                                               theme="dark"
                                                               onEmojiClick={(emoji) => setInput((prev) => prev + emoji.emoji)}
                                                        />
                                                 </div>
                                          )}
                                   </SheetContent>
                            </Sheet>
                     </div>
              </>
       );
};

export default GlobalChat;
