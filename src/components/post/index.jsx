import { ChatBubbleOutlineOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../data/store";
import { styled } from "@mui/system";
import UserImageIcon from "../userImageIcon";
import axios from "axios"; //For sending api requests, reference: https://www.npmjs.com/package/axios
import { useNavigate } from "react-router-dom";
import { Image } from 'cloudinary-react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Comment from "./comment"
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ModifiedFlexBox from "../modifiedFlexBox";

//Creates a padded box with shadow.
const ShadowBox = styled(Box)(({ theme }) => ({
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",
  backgroundColor: theme.palette.background.alt,
  borderRadius: "0.75rem",
  boxShadow: "4px 4px 8px #ccc"
}));


//This component displays a user info with post.
const UserTag = ({ postUserId, postUsername, userPictureUrl, date }) => {

  //Hooks
  const navigate = useNavigate();

  //Theme
  const { palette } = useTheme();

  //Formats Time Stamp for the post.
  const getTimeStamp = (dateStamp) => {
    const currentDate = new Date();
    const targetPostDate = new Date(dateStamp);

    const secondsPassed = Math.floor((currentDate - targetPostDate) / 1000);

    if (secondsPassed < 60) {
      return `${secondsPassed}s`;
    } 
    else if (secondsPassed < 3600) {
      const minutes = Math.floor(secondsPassed / 60);

      return `${minutes}m`;
    } 
    else if (secondsPassed < 86400) {
      const hours = Math.floor(secondsPassed / 3600);

      return `${hours}h`;
    } 
    else if (secondsPassed < 2592000) {
      const days = Math.floor(secondsPassed / 86400);

      return `${days}d`;
    } 
    else if (secondsPassed < 31536000) {
      const months = Math.floor(secondsPassed / 2592000);

      return `${months}mo`;
    }
    else {
      const years = Math.floor(secondsPassed / 31536000);

      return `${years}y`;
    }
  }

  return (
    <ModifiedFlexBox>
      <ModifiedFlexBox gap="1rem">
        <UserImageIcon image={userPictureUrl} size="50px" />
        <Box
          onClick={() => {
            navigate(`/profile/${postUserId}`);
            navigate(0);
          }}
        >
          <Typography
            color={palette.neutral.main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: "#cfcfcf",
                cursor: "pointer",
              },
            }}
          >
            {postUsername}
          </Typography>
          <Typography color={palette.neutral.mediumMain} fontSize="0.65rem">
            {getTimeStamp(date)}
          </Typography>
        </Box>
      </ModifiedFlexBox>
    </ModifiedFlexBox>
  );
};

//This component manages UI for post.
const Post = ({
  postId,
  postUserId,
  description,
  resource,
  likes,
  comments,
  createdAt,
  onDeletePost
}) => {

  //These states manages comments.
  const [isComments, setIsComments] = useState(false);
  const [commentsState, setCommentsState] = useState(comments); 
  const [newComment, setNewComment] = useState("");

  //Hook
  const dispatch = useDispatch();
  
  //User Info
  const currentUser = useSelector((state) => state.userInfo);
  const jwtToken = currentUser?.userAccessToken;
  const loggedInUserId = currentUser?.Id;

  //Like Engagement info.
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  //Do not render post if fetching it from database.
  const [isLoading, setIsLoading] = useState(true);

  //Delete post confirmation dialog State.
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  //Theme.
  const { palette } = useTheme();

  //State manages Profile Picture associated with user that posted.
  const [postUserProfilePicState, setPostUserProfilePicState] = useState("");

  //State manages full name associated with user that posted.
  const [name, setName] = useState("");
  

  //Handler for adding a new comment
  const handleAddComment = () => {
    if(newComment!== "") {
      
      const commentData = {
        userId: loggedInUserId,
        commentText: newComment,
      };
    
      axios.patch(`${process.env.REACT_APP_SERVER_API_URL}/posts/${postId}/comments`, commentData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response && response.data) {
          setCommentsState((prevComments) => [...prevComments, response.data.comments[response.data.comments.length - 1]]);
          const updatedPost = response.data;
          dispatch(setPost({ post: updatedPost }));
        } 
        else {
          console.error("Invalid response from the server while adding comment");
        }
      })
      .catch((e) => {
          console.error("Error while adding comment:", e);
      });
    }

    setNewComment("");
  };

  //Callback for deleting comments.
  const handleDeleteComment = (commentId) => {

    const updatedComments = commentsState.filter((c) => c._id !== commentId);

    setCommentsState(updatedComments);
  };


  //Handler for deleting Post.
  const handleDeletePost = () => {

    axios
      .delete(`${process.env.REACT_APP_SERVER_API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })
      .then((response) => {
        onDeletePost(postId);
      })
      .catch((e) => {
        console.error("Error while deleting post:", e);
      });

    setShowDeleteDialog(false);
  };

  //This function Fetches user details associated with post.
  const fetchUserDetails = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_API_URL}/user/${postUserId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })
      .then((response) => {
        const tempdata = response.data;
        setPostUserProfilePicState(tempdata.profilePictureUrl);
        setName(`${tempdata.firstName} ${tempdata.lastName}`);
        setIsLoading(false); 
        
      })
      .catch((e) => {
        setIsLoading(false);
        console.error("Error while fetching user details associated with post:", e);
      });
  }

  // Fetch user data and update the user info state when the component mounts or when user changes.
  useEffect(() => {
    fetchUserDetails();
  }, [postUserId, jwtToken]); //eslint-disable-line react-hooks/exhaustive-deps


  //Handler for like action by the user.
  const likeHandler = () => {
    axios
      .patch(
        `${process.env.REACT_APP_SERVER_API_URL}/posts/${postId}/like`,
        { userId: loggedInUserId },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const updatedPost = response.data;
        dispatch(setPost({ post: updatedPost }));
      })
      .catch((e) => {
        console.error("Error while patching like:", e);
      });
  };

  if (!isLoading) {
    return (
    
      <ShadowBox m="2rem 0">
        
        <ModifiedFlexBox>
          <UserTag
            postUserId={postUserId}
            postUsername={name}
            userPictureUrl={postUserProfilePicState}
            date={createdAt}
          />

          {(loggedInUserId === postUserId) &&
            <IconButton onClick={() => setShowDeleteDialog(true)} style={{ marginTop: '-65px', marginRight: '-20px' }}>
              <CancelOutlinedIcon />
            </IconButton>         
          }
        </ModifiedFlexBox>


        <Typography color={palette.neutral.main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>

        {(resource.length > 0) && (
          <Image
            cloudName={process.env.REACT_APP_MEDIA_CLOUD_NAME}
            publicId={resource[0].public_id}
            crop="scale"
            style={{  width: 'calc(100% + 3rem)', 
                      maxHeight: '100%', 
                      height: 'auto', 
                      marginTop: "0.75rem",
                      marginLeft: '-1.5rem', 
                      marginRight: '-1.5rem'}}
          />
        )}

        <ModifiedFlexBox mt="0.25rem">
          <ModifiedFlexBox gap="1rem">
            
            <ModifiedFlexBox gap="0.3rem">
              <IconButton onClick={likeHandler}>
                {isLiked ? (
                  <ThumbUpIcon sx={{ color: palette.primary.main }} />
                ) : 
                (
                  <ThumbUpOutlinedIcon />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </ModifiedFlexBox>
  
            <ModifiedFlexBox gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{commentsState.length}</Typography>
            </ModifiedFlexBox>

          </ModifiedFlexBox>
        </ModifiedFlexBox>

        {isComments && (
          <Box mt="1rem">
            <Box
              sx={{
                maxHeight: "200px",
                overflowY: "auto",
                p: "0.5rem",
                borderRadius: "0.75rem",
                backgroundColor: palette.background.paper,
              }}
            >
              {commentsState.slice().reverse().map((comment, i) => (
                <Comment
                  comment = {comment}
                  i       =  {i}
                  onDeleteComment = {handleDeleteComment}
                  postId  =  {postId}
                />
              ))}
            </Box>

            <Box mt="1rem" display="flex" alignItems="center" sx={{p: "0.5rem"}}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleAddComment}>
                      <SendIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Box>
        )}

        <Dialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this post?
              </Typography>
            </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowDeleteDialog(false)}
              color="primary"
            >
              No
            </Button>
            <Button
              onClick={handleDeletePost}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </ShadowBox>
    );
  }; //end of if(!isLoading)
};
  
export default Post;