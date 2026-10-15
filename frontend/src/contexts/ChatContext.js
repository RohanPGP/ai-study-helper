import { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [studyPackContext, setStudyPackContext] = useState(null);
  return (
    <ChatContext.Provider value={{ studyPackContext, setStudyPackContext }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
