import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../data/store";
import Post from "../post";
import axios from "axios"; //For sending api requests, reference: https://www.npmjs.com/package/axios
import {Box, CircularProgress} from "@mui/material";
import CenterFlexBox from "../centerFlexBox";

//This component manages posts for both home and profile pages.
const PostsManager = ({ Id, isUserProfilePage = false }) => {

  //This state manages all posts to display.
  const posts = useSelector((state) => state.posts);

  //User Info.
  const currentUser = useSelector((state) => state.userInfo);
  const jwtToken = currentUser?.userAccessToken;

  //Hooks
  const dispatch = useDispatch();
  
  //State manages loader.
  const [loading, setLoading] = useState(true);

  //Fetches posts for home page for current user.
  const fetchPosts = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_API_URL}/posts`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })
      .then((response) => {
        const data = response.data;
        dispatch(setPosts({ posts: data }));
      })
      .catch((e) => {
        console.error("Error while fetching posts:", e);
      })    
      .finally(() => {
        setLoading(false);
      });
  };

  //Fetches posts for profile page for current user.
  const fetchPostsForUser = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_API_URL}/posts/${Id}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })
      .then((response) => {
        const data = response.data;
        dispatch(setPosts({ posts: data }));
      })
      .catch((e) => {
        console.error("Error while fetching user posts:", e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //Handles fetching posts for given page.
  useEffect(() => {
    if (isUserProfilePage) {
      fetchPostsForUser();
    } else {
      fetchPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //Callback function for handling delete post for the specific postId.
  const handleDeletePost = (postId) => {
    const updatedPosts = posts.filter((post) => post._id !== postId);
    dispatch(setPosts({ posts: updatedPosts }));
  };

  return (
    <>
      {loading ? (
        <Box  m="2rem 0" 
              style = {{  padding: "1.5rem 1.5rem 0.75rem 1.5rem"}}
        >
          <CenterFlexBox>
            <CircularProgress size={24} color="primary" /> 
          </CenterFlexBox>
        </Box>
      ) : (
        posts.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            resource,
            likes,
            comments,
            createdAt
          }) => (
            <Post
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              resource={resource}
              likes={likes}
              comments={comments}
              createdAt = {createdAt}
              onDeletePost={handleDeletePost}
            />
          )
        )
      )}
    </>
  );
};

export default PostsManager;