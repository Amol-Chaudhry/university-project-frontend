import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar";
import UserInfoBriefBox from "../../components/userInfoBriefBox";
import CreatePostBox from "../../components/createPostBox";
import PostsManager from "../../components/postsManager";
import axios from "axios"; //For sending api requests, reference: https://www.npmjs.com/package/axios

//This page manages profile page for the user
const ProfilePage = () => {

  //This state manages profile page to show for which user.
  const [user, setUser] = useState(null);
  
  //Path path giving user id.
  const { id } = useParams();

  //User info for logged in user id
  const loggedInUser = useSelector((state) => state.userInfo);
  const jwtToken = loggedInUser?.userAccessToken;

  //Media query.
  const isDesktop = useMediaQuery("(min-width:1024px)");

  //This fetches user info using API.
  const fetchUserProfileInfo = async () => {
    axios
    .get(`${process.env.REACT_APP_SERVER_API_URL}/user/${id}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    })
    .then((response) => {
      const data = response.data;
      setUser(data);
    })
    .catch((e) => {
      console.error(e);
    });
  };

  useEffect(() => {
    fetchUserProfileInfo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //if unable to fetch user do not render page.
  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isDesktop ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isDesktop ? "26%" : undefined}>
          <UserInfoBriefBox Id={id} />
          <Box m="2rem 0" />
        </Box>
        <Box
          flexBasis={isDesktop ? "42%" : undefined}
          mt={isDesktop ? undefined : "2rem"}
        >
          <CreatePostBox/>
          <Box m="2rem 0" />
          <PostsManager Id={id} isUserProfilePage />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;