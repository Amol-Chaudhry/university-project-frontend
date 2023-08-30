import { EditOutlined, DeleteOutlined } from "@mui/icons-material";
import {Box, Divider, Typography, InputBase, useTheme, IconButton, CircularProgress } from "@mui/material";
import Dropzone from "react-dropzone"; //Handling Drag and Drop, reference: https://www.npmjs.com/package/react-dropzone
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../data/store";
import UserImageIcon from "../userImageIcon";
import axios from "axios"; //For sending api requests, reference: https://www.npmjs.com/package/axios
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import SendIcon from '@mui/icons-material/Send';
import ModifiedFlexBox from "../modifiedFlexBox";
import PaddedBox from "../paddedBox";


//This component manages UI for creating posts.
const CreatePostBox = () => {

  //These states manage drag & drop images.
  const [isPicDragged, setPicDragged] = useState(false);
  const [picture, setPicture] = useState(null);

  //State manges post.
  const [post, setPost] = useState("");
  
  //Hooks.
  const dispatch = useDispatch();
  
  //Theme.
  const { palette } = useTheme();
  
  //userInfo
  const user = useSelector((state) => state.userInfo);
  const Id = user?.Id;
  const jwtToken = user?.userAccessToken;

  //For Loader.
  const [isLoading, setLoading] = useState(false);
  
  // Handles API call for submit post.
  const submitPostHandler = async () => {
    setLoading(true);

    //Form data for handling media resources.
    const tempData = new FormData();
    tempData.append("userId", Id);
    tempData.append("description", post);
    if (picture) {
      tempData.append("resourceType", "image");
      tempData.append("resource", picture);
    }
    axios.post(`${process.env.REACT_APP_SERVER_API_URL}/posts`, tempData, {
      headers: { 
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    .then((response) => {
      const posts = response.data;
      dispatch(setPosts({ posts }));
      setPicDragged(!isPicDragged);
      setPicture(null);
      setPost("");
    })
    .catch((error) => {
      console.error("Error while creating post:", error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <PaddedBox>
      <ModifiedFlexBox gap="1rem">
        <UserImageIcon image={user.profilePictureUrl} size={"50px"}/>
        <InputBase
          placeholder="Start a post..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            height: "3rem",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </ModifiedFlexBox>
      
      {isPicDragged && (
        <Box
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setPicture(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <ModifiedFlexBox>
                <Box
                  {...getRootProps()}
                  border={`3px dashed ${palette.primary.main}`}
                  borderRadius={"8px"}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!picture ? (
                    <p>Click to choose picture or Drop here.</p>
                  ) : 
                  (
                    <ModifiedFlexBox>
                      <Typography>{picture.name}</Typography>
                      <IconButton>
                        <EditOutlined />
                      </IconButton>
                    </ModifiedFlexBox>
                  )}
                </Box>
                {picture && (
                  <IconButton
                    onClick={() => setPicture(null)}
                    sx={{ width: "10%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </ModifiedFlexBox>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider 
        sx={{ marginTop: "1rem",
              marginBottom: "0.5rem",
              marginLeft: "-1.5rem",
              marginRight: "-1.5rem",
              width: 'calc(100% + 3rem)' 
        }}  
      />

      <ModifiedFlexBox>
        <ModifiedFlexBox gap="0.25rem" onClick={() => setPicDragged(!isPicDragged)}>
          <AddPhotoAlternateOutlinedIcon sx={{ color: palette.neutral.mediumMain }} />
          <Typography
            color={palette.neutral.mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: palette.neutral.medium } }}
          >
            Add Photo
          </Typography>
        </ModifiedFlexBox>

        <IconButton
          disabled={(!post) || isLoading}
          onClick={submitPostHandler}
          sx={{
            color: palette.primary.main,
            borderRadius: "1.5rem",
            width: "83px", // Adjust the width and height to your preference
            height: "25px",
          }}
        >
          {isLoading ? (<CircularProgress size={24} color="inherit" />) :
            <>
              <Typography
                color={!post? palette.primary.alt : palette.primary.main}
                sx={{
                  fontSize: "15px",
                  fontFamily: 'Pacifico', 
                  "&:hover": {cursor: "pointer", color: palette.neutral.medium },
                }}
              >
                Share
              </Typography>
              <SendIcon sx={{ fontSize: "25px", marginLeft: "10px" }} />
              </>
          }
        </IconButton>
      </ModifiedFlexBox>
    </PaddedBox>
  );
};
  
export default CreatePostBox;