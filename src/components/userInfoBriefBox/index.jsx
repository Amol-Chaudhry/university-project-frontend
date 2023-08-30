import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import axios from 'axios'; //For sending api requests, reference: https://www.npmjs.com/package/axios
import PaddedBox from "../paddedBox";
import CenterFlexBox from "../centerFlexBox";
  
const UserInfoBriefBox = ({ Id }) => {

  //State Manages user Info.
  const [user, setUser] = useState(null);

  //Theme
  const { palette } = useTheme();

  //Hooks
  const navigate = useNavigate();

  //Logged In user JWT Token.
  const jwtToken = useSelector((state) => state.userInfo?.userAccessToken);

  //Handle Fetching user for passed Id props.
  const fetchUser = () => {
    axios.get(`${process.env.REACT_APP_SERVER_API_URL}/user/${Id}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })
      .then((response) => {
        const data = response.data;
        setUser(data);
      })
      .catch((e) => {
        console.error("Error while fetching user:", e.message);
      });
  };

  //Fetches user.
  useEffect(() => {
    fetchUser();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  //If not able to fetch user return null.
  if (!user) return null;

  return (
    <PaddedBox>
      <Box
        onClick={() => navigate(`/profile/${Id}`)}
        sx={{
          "&:hover": {
            cursor: "pointer"
          },
        }}
      >
        <Box style={{ position: 'relative' }}>
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 'calc(100% + 3rem)',
              height: '100%',
              zIndex: 1,
              marginTop: "-1.5rem",
              marginLeft: "-1.5rem",
              marginRight: "-1.5rem",
            }}
          >
            <img
              style={{ objectFit: "cover", borderRadius: "0.75rem 0.75rem 0 0" }}
              width="100%"
              height="100%"
              alt="cover"
              src={user.coverPictureUrl} 
            />
          </Box>
          <CenterFlexBox>
            <Box  style={{zIndex: 2}}>
              <Box width="125px" height="125px">
                <img
                  style={{
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2.5px solid white",
                  }}
                
                  width="125px"
                  height="125px"
                  alt="user"
                  src={user.profilePictureUrl}
                />
              </Box>
            </Box>
          </CenterFlexBox>
        </Box>
        
        <CenterFlexBox>
          <Box p="1rem 0">
            <Typography
              variant="h4"
              color="black"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                navigate(`/profile/${user._id}`);
                navigate(0);
              }}
            >
              {user.firstName} {user.lastName}
            </Typography>
          </Box>
        </CenterFlexBox>
      </Box>
      <Divider
        sx={{
          marginLeft: "-1.5rem",
          marginRight: "-1.5rem",
          width: 'calc(100% + 3rem)',
        }}        
      />
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <PersonIcon fontSize="large" sx={{ color: palette.neutral.main }} />
          <Typography color={palette.neutral.mediumMain}>@{user.userName}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <SchoolIcon fontSize="large" sx={{ color: palette.neutral.main }} />
          <Typography color={palette.neutral.mediumMain}>{user.courseTitle}</Typography>
        </Box>
      </Box>
      {(user?.about) &&   
        <>
          <Divider
            sx={{
              marginLeft: "-1.5rem",
              marginRight: "-1.5rem",
              width: 'calc(100% + 3rem)',
            }}        
          />
          <Box p="1rem 0">
            <Typography fontSize="1rem" color={palette.neutral.main} fontWeight="500" mb="1rem">
             About
            </Typography>
            <Typography color={palette.neutral.mediumMain}>{user.about}</Typography>
          </Box>
        </>
      }
      { (user?.socialMedia?.facebook || user?.socialMedia?.twitter || user?.socialMedia?.instagram || user?.socialMedia?.linkedin) &&   
       
        <>
          <Divider
            sx={{
              marginLeft: "-1.5rem",
              marginRight: "-1.5rem",
              width: 'calc(100% + 3rem)',
            }}        
          />
          <Box p="1rem 0">
            <Typography fontSize="1rem" color={palette.neutral.main} fontWeight="500" mb="1rem">
              Discover More
            </Typography>
            <CenterFlexBox gap="1.5rem" mb="0.5rem">
              {(user?.socialMedia?.facebook) && 
                <a href={user.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                  <IconButton>
                    <FacebookIcon fontSize="large" sx={{ color: palette.neutral.main }} />
                  </IconButton>
                </a>
              }
              { (user?.socialMedia?.instagram) &&
                <a href={user.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                  <IconButton>
                    <InstagramIcon fontSize="large" sx={{ color: palette.neutral.main }} />
                  </IconButton>
                </a>
              }         
              { (user?.socialMedia?.twitter) && 
                <a href={user.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                  <IconButton>
                    <img src="../../../assets/images/X.svg"  alt="twitter" className="custom-svg" style={{ width: '35px', height: '35px'}} />
                  </IconButton>
                </a>
              }   
              { (user?.socialMedia?.linkedin) && 
                <a href={user.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                  <IconButton>
                    <LinkedInIcon fontSize="large" sx={{ color: palette.neutral.main }} />
                  </IconButton>
                </a>
              }                
            </CenterFlexBox>
          </Box>
        </>
      } 
    </PaddedBox>
  );
};

export default UserInfoBriefBox;