import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare } from "lucide-react";

const GlobalChat = () => {
       const [messages, setMessages] = useState([]);
       const [input, setInput] = useState("");

       const sendMessage = () => {
              if (input.trim() === "") return;
              setMessages([...messages, input]);
              setInput("");
       };

       return (
              <>
                     {/* Large screens: always visible sidebar */}
                     <div className="hidden lg:flex flex-col h-full w-[25%] bg-[#131620] border-l border-gray-700 p-4">
                            <h2 className="text-lg font-bold mb-2">Global Chat</h2>
                            <div className="flex-1 overflow-y-auto mb-2 space-y-2">
                                   {messages.map((msg, idx) => (
                                          <div
                                                 key={idx}
                                                 className="bg-[#2D3660] p-2 rounded text-white text-sm"
                                          >
                                                 {msg}
                                          </div>
                                   ))}
                            </div>
                            <div className="flex gap-2">
                                   <input
                                          type="text"
                                          value={input}
                                          onChange={(e) => setInput(e.target.value)}
                                          placeholder="Type a message..."
                                          className="flex-1 px-2 py-1 rounded bg-[#131620] text-white outline-none"
                                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                   />
                                   <button
                                          onClick={sendMessage}
                                          className="bg-[#EC981A] px-3 rounded text-black font-semibold"
                                   >
                                          Send
                                   </button>
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
                                          className="h-[400px] bg-[#1A1F2B] p-4 flex flex-col"
                                   >
                                          <h2 className="text-lg font-bold mb-2 text-white">Global Chat</h2>
                                          <div className="flex-1 overflow-y-auto mb-2 space-y-2">
                                                 {messages.map((msg, idx) => (
                                                        <div
                                                               key={idx}
                                                               className="bg-[#2D3660] p-2 rounded text-white text-sm"
                                                        >
                                                               {msg}
                                                        </div>
                                                 ))}
                                          </div>
                                          <div className="flex gap-2">
                                                 <input
                                                        type="text"
                                                        value={input}
                                                        onChange={(e) => setInput(e.target.value)}
                                                        placeholder="Type a message..."
                                                        className="flex-1 px-2 py-1 rounded bg-[#131620] text-white outline-none"
                                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                                 />
                                                 <button
                                                        onClick={sendMessage}
                                                        className="bg-[#EC981A] px-3 rounded text-black font-semibold"
                                                 >
                                                        Send
                                                 </button>
                                          </div>
                                   </SheetContent>
                            </Sheet>
                     </div>
              </>
       );
};

export default GlobalChat;
