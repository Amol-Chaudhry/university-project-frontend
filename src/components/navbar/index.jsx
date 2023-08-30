import {Box, IconButton, Typography, MenuItem, Menu, useTheme, useMediaQuery} from "@mui/material";
import {Menu as MenuIcon, Close as CloseIcon, ExitToApp, AccountCircle } from "@mui/icons-material";
import ChatIcon from '@mui/icons-material/Chat';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetUserInfo } from "../../data/store";
import { useNavigate } from "react-router-dom";
import UserImageIcon from "../userImageIcon";
import ModifiedFlexBox from "../modifiedFlexBox";
import SearchModal from "./searchModal";
import './index.css';


//Navbar component to be used when user is logged in.
const Navbar = () => {

  //State for handing navbar for different screens.
  const [isCollapsedMenu, toggleCollapsedMenu] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  //For menu on right of Navbar.
  const [menuAnchor, setMenuAnchor] = useState(null);

  //Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //User Info
  const user = useSelector((state) => state.userInfo);

  //Theme
  const theme = useTheme();

  //State for Search Modal.
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  //Search Icon Click Handler
	const handleSearchClick = (event) => {
    toggleCollapsedMenu(!isCollapsedMenu);
    setIsSearchModalOpen(true);
  };

  //User Image Icon Click Open Handler
  const handleImageClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  //User Image Icon Click Close Handler
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  //Logout Selected.
  const handleLogout = () => {
    dispatch(resetUserInfo());
    handleMenuClose();
  };

  //Chat icon clicked.
  const handleChatIconClick = () => {
    navigate("/messenger"); 
  };

  return (
    <>
      <ModifiedFlexBox padding="0.5rem 6%" backgroundColor={theme.palette.background.alt} 
        className="navbar-container"
      >
        <Typography
          fontWeight="regular"
          color="primary"
          onClick={() => navigate("/home")}
          fontSize="clamp(1rem, 1.75rem, 2rem)"
          sx={{
            "&:hover": {
              color: theme.palette.primary.light,
              cursor: "pointer",
            },
            fontFamily: 'Pacifico'
          }}
        >
          BhamConnect
        </Typography>

        {isDesktop ? (
          <ModifiedFlexBox gap="1rem">
            <IconButton onClick={handleSearchClick} color='inherit'>	
              <PersonSearchIcon sx={{ fontSize: "27px" }} />
            </IconButton>
            <IconButton onClick={handleChatIconClick} color='inherit'>
              <ChatIcon sx={{ fontSize: "27px"}} />
            </IconButton>
            <IconButton onClick={handleImageClick}>	
              <UserImageIcon image={user.profilePictureUrl } size = {"27px"}/>
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              getContentAnchorEl={null}
              slotProps={{paper: { style: { minWidth: "250px" }}}}
            >
              <MenuItem onClick={() => navigate("/edit-profile")}>
                <AccountCircle sx={{ marginRight: "0.5rem", fontSize: "30px" }}/>
                Edit Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ marginRight: "0.5rem", fontSize: "30px" }} />
                Logout
              </MenuItem>
            </Menu>  
          </ModifiedFlexBox>
        ) : 
        (
          <IconButton onClick={() => toggleCollapsedMenu(!isCollapsedMenu)}>
            <MenuIcon />
          </IconButton>
        )}

        {!isDesktop && isCollapsedMenu && (
          <Box
            position="fixed"
            height="100%"
            right="0"
            bottom="0"
            zIndex="11"
            minWidth="250px"
            maxWidth="350px"
            backgroundColor={theme.palette.background.default}
          >
            <Box display="flex" p="1rem" justifyContent="flex-end">
              <IconButton
                onClick={() => toggleCollapsedMenu(!isCollapsedMenu)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <ModifiedFlexBox
              display="flex"
              gap="2.5rem"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <IconButton onClick={handleSearchClick} color='inherit'>	
                <PersonSearchIcon sx={{ fontSize: "27px" }}/>
              </IconButton>
              <IconButton onClick={handleChatIconClick} color='inherit'>
                <ChatIcon sx={{ fontSize: "27px" }} />
              </IconButton>
              <IconButton onClick={handleImageClick}>	
                <UserImageIcon image={user.profilePictureUrl } size = {"27px"}/>
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                getContentAnchorEl={null}
              >
                <MenuItem onClick={() => navigate("/edit-profile")}>
                  <AccountCircle sx={{ marginRight: "0.5rem", fontSize: "30px" }}/>
                  Edit Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ marginRight: "0.5rem", fontSize: "30px" }} />
                  Logout
                </MenuItem>
              </Menu>
            </ModifiedFlexBox>
          </Box>
        )}
      </ModifiedFlexBox>
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </>
  );
};

export default Navbar;