import {Box, Button, CircularProgress, TextField, useTheme, useMediaQuery, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Icon } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, Edit as EditIcon} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Formik } from "formik"; // For Building forms, reference: https://www.npmjs.com/package/formik
import * as yup from "yup"; //For validations, reference: https://www.npmjs.com/package/yup
import axios from 'axios'; //For sending api requests, reference: https://www.npmjs.com/package/axios
import { setUserInfo } from "../../data/store";

//Validations
const editUserValidations = yup.object().shape({
  firstName: yup.string().required("required").max(150, "First Name should not exceed 150 characters."),
  lastName: yup.string().required("required").max(150, "Last Name should not exceed 150 characters."),
  courseTitle: yup.string().required("required"),
  facebookLink: yup.string().url(),
  instagramLink: yup.string().url(),
  linkedinLink: yup.string().url(),
  twitterLink: yup.string().url(),
  about: yup.string()
});

//Initial values
const editUserValuesInitial =  (user) => {
  const {
    firstName = '',
    lastName = '',
    courseTitle = '',
    socialMedia = {},
    about = ''
  } = user;

  const {
    facebook: facebookLink = '',
    twitter: twitterLink = '',
    instagram: instagramLink = '',
    linkedin: linkedinLink = ''
  } = socialMedia;

  return {firstName, lastName, courseTitle, facebookLink, instagramLink, linkedinLink, twitterLink , about};
};


const EditProfileForm = () => {
  
  //Media query
  const isDesktop = useMediaQuery("(min-width: 576px)");
  
  //Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  //Theme
  const { palette } = useTheme();

  //For Loader.
  const [isLoading, setLoading] = useState(false);

  //User Info
  const user = useSelector((state) => state.userInfo);
  const token = user?.userAccessToken;

  //Accordion States
  const [socialMediaOpen, setSocialMediaOpen] = useState(false);
  const [coverPhotoOpen, setCoverPhotoOpen] = useState(false);

  //Selected Images(profile and cover) states.
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);	
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);	

  //Handles API call.
  const editUser = (values, onSubmitProps) => {
    setLoading(true);
    let formData = new FormData();

    for (let value in values) {
      formData.append(value, values[value]);
    }

    if(selectedProfileImage) formData.append("profilePicture", selectedProfileImage);
    if(selectedCoverImage) formData.append("coverPicture", selectedCoverImage);
    
    axios.patch(`${process.env.REACT_APP_SERVER_API_URL}/user/`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
      }
    })
    .then(
      response => {
        const responseData = response.data;
        if (responseData) {
          dispatch(
            setUserInfo({
                userInfo: {
                  Id: responseData._id,
                  email: user.email,
                  firstName: responseData.firstName,
                  lastName: responseData.lastName,
                  userName: user.userName,
                  courseTitle: responseData.courseTitle,
                  profilePictureUrl: responseData.profilePictureUrl,
                  coverPictureUrl: responseData.coverPictureUrl,
                  socialMedia: responseData.socialMedia,
                  about: responseData.about,
                  userAccessToken: user.userAccessToken,
                }
            })
          );
          navigate("/home");
        }
      }
    )
    .catch(e => {
      console.error(e);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  //Form submit handler.
  const handleSubmit = async (values, onSubmitProps) => {
    await editUser(values, onSubmitProps);
  };

  //Profile Image Selection Handler
  const handleProfileImageSelect = (event) => {
    const file = event.target.files[0];

    if (file) {
      //selected file is converted to File Object. 
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        const binaryString = atob(base64String);
        const byteArray = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }
        const selectedFile = new File([byteArray], file.name, { type: file.type });

        setSelectedProfileImage(selectedFile);
      };
      reader.readAsDataURL(file);
    }
  };

  //Cover Image Selection Handler
  const handleCoverImageSelect = (event) => {
    const file = event.target.files[0];

    if (file) {
      //selected file is converted to File Object. 
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        const binaryString = atob(base64String);
        const byteArray = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }
        const selectedFile = new File([byteArray], file.name, { type: file.type });

        setSelectedCoverImage(selectedFile);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Formik onSubmit={handleSubmit} validationSchema={editUserValidations} initialValues={editUserValuesInitial(user)}>
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit
      }) => (
        <form onSubmit={handleSubmit}>
          <Box gap="26px" display="grid" gridTemplateColumns="repeat(4, minmax(0, 1fr))" 
            sx={{"& > div": { gridColumn: isDesktop ? undefined : "span 4" } }}
          >
            <Box sx={{ gridColumn: "span 4", py: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "center", position: "relative" }}>
                <label htmlFor="profileImageInput">
                  <IconButton
                    component="span"
                    aria-label="Edit Profile Image"
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      backgroundColor: palette.background.paper,
                      "&:hover": {
                        backgroundColor: palette.background.default,
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </label>
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageSelect}
                  style={{ display: "none" }}
                />                 
                <Icon
                  component="img"
                  src={selectedProfileImage ? URL.createObjectURL(selectedProfileImage) : user.profilePictureUrl}
                  sx={{
                    width: "175px",
                    height: "175px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "primary.main",
                    boxShadow: 2,
                  }}
                />
              </Box>
            </Box>
            <Box gridColumn="span 4">
              <Accordion expanded={coverPhotoOpen} onChange={() => setCoverPhotoOpen((prev) => !prev)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="cover-photo-content"
                  id="cover-photo-header"
                >
                  <Typography variant="body1">
                   Cover picture
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box gap="25px" display="grid" gridTemplateColumns="repeat(4, minmax(0, 1fr))" 
                    sx={{"& > div": { gridColumn: isDesktop ? undefined : "span 4" } }}
                  >
                    <Box sx={{ gridColumn: "span 4", py: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "center", position: "relative" }}>
                        <label htmlFor="coverImageInput">
                          <IconButton
                            component="span"
                            aria-label="Edit Cover Image"
                            sx={{
                              position: "absolute",
                              top: "-10px",
                              right: "-5px",
                              backgroundColor: palette.background.paper,
                              "&:hover": {
                                backgroundColor: palette.background.default,
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </label>
                        <input
                          id="coverImageInput"
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageSelect}
                          style={{ display: "none" }}
                        />                 
                        <Box
                          sx={{
                            width: "100%", 
                            maxWidth: "350px", 
                            borderRadius: "5px",
                            overflow: "hidden",
                            boxShadow: 2,
                          }}
                        >
                          <Icon
                            component="img"
                            src={selectedCoverImage ? URL.createObjectURL(selectedCoverImage) : user.coverPictureUrl}
                            sx={{
                              width: "100%",
                              height: "auto", // This ensures the image scales proportionally
                              display: "block",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>   
            <TextField
              label="First Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.firstName}
              name="firstName"
              error={Boolean(touched.firstName) && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Last Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.lastName}
              name="lastName"
              error={Boolean(touched.lastName) && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              sx={{ gridColumn: "span 2" }}
            />                           
            <TextField
              label="Course Title"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.courseTitle}
              name="courseTitle"
              error={Boolean(touched.courseTitle) && Boolean(errors.courseTitle)}
              helperText={touched.courseTitle && errors.courseTitle}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="About"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.about}
              name="about"
              error={Boolean(touched.about) && Boolean(errors.about)}
              helperText={touched.about && errors.about}
              sx={{ gridColumn: "span 4" }}
            />

            <Box gridColumn="span 4">
              <Accordion expanded={socialMediaOpen} onChange={() => setSocialMediaOpen((prev) => !prev)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="social-media-content"
                  id="social-media-header"
                >
                  <Typography variant="body1"> Social media links</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box gap="25px" display="grid" gridTemplateColumns="repeat(4, minmax(0, 1fr))" 
                    sx={{"& > div": { gridColumn: isDesktop ? undefined : "span 4" } }}
                  >
                    <TextField
                      label="Facebook"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.facebookLink}
                      name="facebookLink"
                      error={Boolean(touched.facebookLink) && Boolean(errors.facebookLink)}
                      helperText={touched.facebookLink && errors.facebookLink}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      label="Instagram"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.instagramLink}
                      name="instagramLink"
                      error={Boolean(touched.instagramLink) && Boolean(errors.instagramLink)}
                      helperText={touched.instagramLink && errors.instagramLink}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      label="LinkedIn"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.linkedinLink}
                      name="linkedinLink"
                      error={Boolean(touched.linkedinLink) && Boolean(errors.linkedinLink)}
                      helperText={touched.linkedinLink && errors.linkedinLink}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      label="Twitter"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.twitterLink}
                      name="twitterLink"
                      error={Boolean(touched.twitterLink) && Boolean(errors.twitterLink)}
                      helperText={touched.twitterLink && errors.twitterLink}
                      sx={{ gridColumn: "span 2" }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
          
          <Button
            fullWidth
            type="submit"
            disabled={isLoading}
            style={{ borderRadius: 35}}
            sx={{
              m: "2rem 0",
              p: "0.75rem",
              backgroundColor: palette.primary.main,
              color: palette.background.alt,
              "&:hover": { color: palette.primary.main }
            }}
          >
            {isLoading ? (<CircularProgress size={24} color="inherit" />) : ("UPDATE")}
          </Button>
          
        </form>
      )}
    </Formik>
  );
};

export default EditProfileForm;