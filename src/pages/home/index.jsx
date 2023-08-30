import Navbar from "../../components/navbar";
import UserInfoBriefBox from "../../components/userInfoBriefBox";
import CreatePostBox from "../../components/createPostBox";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import RecentChats from "../../components/recentChats";
import PostsManager from "../../components/postsManager";


//This Component Manages Home Page UI.
const HomePage = () => {

  //Current User Info.
  const currentUser = useSelector((state) => state.userInfo);

  //Media Query.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isDesktop ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isDesktop ? "26%" : undefined}>
          <UserInfoBriefBox Id={currentUser.Id}/>
        </Box>
        <Box
          flexBasis={isDesktop ? "42%" : undefined}
          mt={isDesktop ? undefined : "2rem"}
        >
          <CreatePostBox/>
          <PostsManager Id={currentUser.Id} />
        </Box>
        {isDesktop && (
          <Box flexBasis="26%">
            <RecentChats />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;