import React, { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { ScrollArea } from "@/components/ui/scroll-area";
const GlobalChat = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [messages, setMessages] = useState([
    { user: "⛳ janalleman", text: "wtf", type: "user", avatar: "🦊" },
    {
      user: "⛳ janalleman",
      text: "i just won upgrader and its not giving me my item",
      type: "user",
      avatar: "🦊",
    },
    {
      user: "🦁 NotTerry",
      text: "Did you click off of the pop up? If you did it'll auto sell it for you with +5% and you'll receive the balance automatically.",
      type: "mod",
      avatar: "🧠",
    },
    {
      user: "⛳ janalleman",
      text: "no i think its lag or something bc when i try to upgrade again ita says game active",
      type: "user",
      avatar: "🦊",
    },
    { user: "⛳ janalleman", text: "oh i got it", type: "user", avatar: "🦁" },
    { user: "🦁 NotTerry", text: "😅", type: "mod", avatar: "🧠" },
    {
      user: "🤝 ZergsRustStakebanditc",
      text: "Tomorrow I get to cf :)",
      type: "user",
      avatar: "🐯",
    },
    {
      user: "🤝 ZergsRustStakebanditc",
      text: "And hopefully I end this 7 loss stream",
      type: "user",
      avatar: "🐯",
    },
    {
      user: "🤝 ZergsRustStakebanditc",
      text: "Streak*",
      type: "user",
      avatar: "🐯",
    },
    { user: "⛳ janalleman", text: "oh i got it", type: "user", avatar: "🦁" },
    { user: "🦁 NotTerry", text: "😅", type: "mod", avatar: "🧠" },
    {
      user: "🤝 ZergsRustStakebanditc",
      text: "Tomorrow I get to cf :)",
      type: "user",
      avatar: "🐯",
    },
    {
      user: "🤝 ZergsRustStakebanditc",
      text: "And hopefully I end this 7 loss stream",
      type: "user",
      avatar: "🐯",
    },
    {
      user: "🤝 ZergsRustStakebanditc",
      text: "Streak*",
      type: "user",
      avatar: "🐯",
    },
    { user: "⛳ janalleman", text: "oh i got it", type: "user", avatar: "🦁" },
    { user: "🦁 NotTerry", text: "😅", type: "mod", avatar: "🧠" },
    {
      user: "🤝 ZergsRustStakebanditc",
      text: "Tomorrow I get to cf :)",
      type: "user",
      avatar: "🐯",
    },
    {
      user: "🤝 ZergsRustStakebanditc",
      text: "And hopefully I end this 7 loss stream",
      type: "user",
      avatar: "🐯",
    },
    {
      user: "🤝 ZergsRustStakebanditc",
      text: "Streak*",
      type: "user",
      avatar: "🐯",
    },
    { user: "⛳ janalleman", text: "oh i got it", type: "user", avatar: "🦁" },
    { user: "🦁 NotTerry", text: "😅", type: "mod", avatar: "🧠" },
    {
      user: "🤝 ZergsRustStakebanditc",
      text: "Tomorrow I get to cf :)",
      type: "user",
      avatar: "🐯",
    },
    {
      user: "🤝 ZergsRustStakebanditc",
      text: "And hopefully I end this 7 loss stream",
      type: "user",
      avatar: "🐯",
    },
    {
      user: "🤝 ZergsRustStakebanditc",
      text: "Streak*",
      type: "user",
      avatar: "🐯",
    },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { user: "You", text: input, type: "user", avatar: "🙋" },
    ]);
    setInput("");
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessages = () =>
    messages.map((msg, idx) => (
      <div key={idx} className="flex items-start gap-3 text-sm">
        {/* Emoji Avatar */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1e2330] text-xl p-2">
          {msg.avatar}
        </div>
        {/* Message */}
        <div>
          <p className="text-[#475A76] text-sm font-semibold">{msg.user}</p>
          <p className="text-[#F3EBFB] leading-tight">{msg.text}</p>
        </div>
      </div>
    ));

  const ChatBox = () => (
    <div className="flex flex-col h-screen  bg-[#131620] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className="text-xl font-bold tracking-wide">LIVE CHAT</h2>
        <span className="text-yellow-400 text-base font-bold">● 35 ONLINE</span>
      </div>

      {/* Messages */}
      <ScrollArea className="h-200 ">
        <div className="flex-1   px-4 py-3 space-y-4  ">
          {renderMessages()}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="relative flex items-center gap-2 p-3 border-t border-gray-700 bg-[#1a1e29]">
        <div className="flex-1 flex items-center bg-[#0f111a] rounded-xl px-3 py-2 border border-gray-700">
          <Input
            className="flex-1 bg-transparent border-none text-gray-300 focus-visible:ring-0 focus-visible:outline-none placeholder-gray-500"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          {/* Emoji Picker Button */}
          <Smile
            className="text-gray-400 hover:text-white cursor-pointer w-5 h-5 ml-2"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          />
        </div>

        <Button
          size="icon"
          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={sendMessage}
        >
          <MessageSquare className="w-5 h-5" />
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
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col  w-[24%]">
        <ChatBox />
      </div>

      {/* Mobile Bottom Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="fixed bottom-4 right-4 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white p-3">
              <MessageSquare className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70%] p-0">
            <ScrollArea className="h-full ">
              <ChatBox />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default GlobalChat;
