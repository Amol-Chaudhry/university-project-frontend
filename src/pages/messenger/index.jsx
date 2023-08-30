import Navbar from "../../components/navbar";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import React from 'react';
import { useMultiChatLogic, MultiChatSocket, MultiChatWindow } from "react-chat-engine-advanced"; // Chat components, reference: https://www.npmjs.com/package/react-chat-engine-advanced
import './index.css';

//This component is used for the Messenger page.
const Messenger = () => {

  //Current User Info.
  const user = useSelector((state) => state.userInfo);
  const chatSecret = useSelector((state) => state.chatSecret);
  const chatProps = useMultiChatLogic(process.env.REACT_APP_CHATENGINE_ID, user?.userName, chatSecret);

  return (
    <Box>
      <Box style={{ borderBottom: '5px solid #E6E6E6' }}>
        <Navbar />
      </Box>
      <Box
        width="100%"
        padding="0rem 0% 0rem"
        gap="0.5rem"
        sx={{borderRadius: "0.75rem"}}
      >
        <div style={{ fontFamily: 'Roboto' }}>
          <MultiChatSocket {...chatProps} />
          <MultiChatWindow  {...chatProps} style={{ height: 'calc(100vh - 64px)' }} />
        </div>
      </Box>
    </Box>
  );
};

export default Messenger;