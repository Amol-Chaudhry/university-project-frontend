import { Box, Divider, Typography, useTheme, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../data/store";
import { useState, useEffect } from "react";
import axios from "axios"; //For sending api requests, reference: https://www.npmjs.com/package/axios
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

//This box manages comments.
const Comment = ({ comment, i, onDeleteComment, postId}) => {

  //Hooks.
  const dispatch = useDispatch();

  //Theme
  const { palette } = useTheme();

  //current UserInfo
  const user = useSelector((state) => state.userInfo);
  const jwtToken = user?.userAccessToken;
  const loggedInUserId = user?.Id;

  //User info for user that commented.
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  //State manges delete comment dialog.
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  //State manges rendering of component.
  const [isLoading, setIsLoading] = useState(true);

  //Fetches user details associated with comment.
  const fetchCommentUserDetails = () => {
    axios
    .get(`${process.env.REACT_APP_SERVER_API_URL}/user/${comment.userId}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    })
    .then((response) => {
      const tempdata = response.data;
      setName(`${tempdata.firstName} ${tempdata.lastName}`);
      setImage(tempdata.profilePictureUrl);
      setIsLoading(false); 
    })
    .catch((error) => {
      setIsLoading(false); 
      console.error(error);
    });
  }

  useEffect(() => {
    fetchCommentUserDetails();
  }, [comment.userId, jwtToken]); //eslint-disable-line react-hooks/exhaustive-deps

  //Delete comment handler.
  const handleDeleteComment = () => {
    axios
    .delete(`${process.env.REACT_APP_SERVER_API_URL}/posts/${postId}/comments/${comment._id}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    })
    .then((response) => {
      if (response) {
        const updatedPost = response.data;
        dispatch(setPost({ post: updatedPost }));
        onDeleteComment(comment._id);
      } 
      else {
        console.error("Invalid response from the server while deleting comment");
      }
    })
    .catch((e) => {
      console.error("Error while deleting comment:", e);
    });

    setShowDeleteDialog(false);
  };

  if (!isLoading) {
    return (
      <Box key={`${i}`} position="relative">
        <Divider variant="middle" />
        <Box display="flex" alignItems="center">
          <img
            src={image}
            alt="Profile"
            style={{ borderRadius: "50%", width: "25px", height: "25px", marginRight: "8px", marginLeft: "1rem" }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ color: palette.neutral.main }}>
              <strong style={{ marginRight: "8px" }}>{name}</strong>
            </Typography>
            <Box sx={{  backgroundColor: "#f0f0f0", 
                        borderRadius: "8px", 
                        p: "8px",
                        m: "7px", 
                        marginRight: "50px",
                        wordWrap: "break-word",   
                        whiteSpace: "pre-wrap"}}
            >
              <Typography sx={{ color: palette.neutral.main, m: 0 }}>
                {comment.commentText}
              </Typography>
            </Box>
          </div>
        </Box>
        {(loggedInUserId === comment.userId) && (
          <IconButton
            sx={{
              position: "absolute",
              top: "50%",
              right: "0.75rem",
              transform: "translateY(-50%)",
            }}
            onClick={() => setShowDeleteDialog(true)} 
          >
            <CancelOutlinedIcon />
          </IconButton>
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
              Are you sure you want to delete this comment?
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
              onClick={handleDeleteComment}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    );
  }
};

export default Comment;