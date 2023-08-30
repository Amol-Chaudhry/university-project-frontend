import React, { useState } from "react";
import { Box, Modal, Fade, InputBase, IconButton, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from 'react-redux';
import axios from 'axios'; //For sending api requests, reference: https://www.npmjs.com/package/axios.
import { useNavigate } from "react-router-dom";

//This component deals with UI related to searching users.
const SearchModal = ({ isOpen, onClose }) => {

  // This state manages the search query.
  const [searchQuery, setSearchQuery] = useState("");

  //Media Query
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // This state manages users returned from API call.
  const [users, setUsers] = useState([]);

  //Hooks
  const navigate = useNavigate();

  //User Info
  const currentUser = useSelector((state) => state.userInfo);
  const jwtToken = currentUser?.userAccessToken;

  //Handler for search input change.
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  //Enter key Handler.
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  //Modal Close Handler.
  const handleClose = () => {
    setUsers([]);
    onClose();
  };

  //Sends API response to our server.
  const handleSearch = () => {
    if(!searchQuery) return;

    axios
    .get(`${process.env.REACT_APP_SERVER_API_URL}/user/search/searchParam?userName=${searchQuery}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    })
    .then((response) => {
      setUsers(response.data.users);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="search-modal"
      aria-describedby="search-modal-description"
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "27%",
            left: "50%",
            transform: "translate(-50%, 0)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "0.5rem",
            outline: "none",
            width: isDesktop ? "473px" : "300px"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #ccc",
              marginBottom: "1rem",
              paddingBottom: "0.5rem",
            }}
          >
            <InputBase
              placeholder="Search People..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
              sx={{ flex: 1 }}
            />
            <IconButton onClick={handleSearch}>
              <SearchIcon/>
            </IconButton>
          </Box>

          <Box sx={{ maxHeight: "200px", overflowY: "auto"}}>
            {users.map((user) => (
              <Box
                key={user._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1rem",
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/profile/${user._id}`);
                  navigate(0);
                }}
              >
                <img
                  src={user.profilePictureUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "1rem",
                  }}
                />
                <div>
                  <p>{user.firstName} {user.lastName}</p>
                  { (user._id === currentUser.Id) &&
                      <p style={{ fontSize: '9px' }} >You</p>
                  }
                </div>
              </Box>
            ))}
          </Box>    
        </Box>
      </Fade>
    </Modal>
  );
};

export default SearchModal;