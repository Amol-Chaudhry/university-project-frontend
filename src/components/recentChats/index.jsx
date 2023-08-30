import { Typography, useTheme } from "@mui/material";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { ChatEngine, ChatList } from 'react-chat-engine'; //Chat UI, reference: https://www.npmjs.com/package/react-chat-engine
import ModifiedFlexBox from "../modifiedFlexBox";
import PaddedBox from "../paddedBox";
import './index.css';

//Displays recent and unread/new chats (via dot).
const RecentChats = () => {

  //Theme
  const { palette } = useTheme();

  //User Info.
  const currentUser = useSelector((state) => state.userInfo);
  const chatSecret = useSelector((state) => state.chatSecret);

  return (
    <PaddedBox>
      <ModifiedFlexBox>
        <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" style={{ marginBottom: '20px' }}>
          Recent Chats
        </Typography>
      </ModifiedFlexBox>
      <Box style={{ maxHeight: '350px', overflow: 'auto' }}>
        <ChatEngine
          projectID={process.env.REACT_APP_CHATENGINE_ID}
          userName={currentUser.userName}
          userSecret={chatSecret}
          renderChatList={(chatAppState) => <ChatList  {...chatAppState} />}
          renderNewChatForm={(creds) => {}}
          renderChatFeed={(chatAppState) => {}}
          renderChatHeader={(chat) => {}}
          renderMessageBubble={(creds, chat, lastMessage, message, nextMessage) => {}}
          renderIsTyping={(typers) => {}}
          renderNewMessageForm={(creds, chatId) => {}}
          renderChatSettings={(chatAppState) => {}}
          renderChatSettingsTop={(creds, chat) => {}}
          renderPeopleSettings={(creds, chat) => {}}
          renderPhotosSettings={(chat) => {}}
          renderOptionsSettings={(creds, chat) => {}}
        />
      </Box>
    </PaddedBox>
  );
};

export default RecentChats;