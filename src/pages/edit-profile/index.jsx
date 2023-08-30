import { Box, Typography, useTheme, useMediaQuery} from "@mui/material";
import EditProfileForm from "./editProfileForm";
import Navbar from "../../components/navbar";

//Component for Edit Profile Options.
const EditProfile = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  
  return (
    <>
      <Navbar />
      <Box
        width={isDesktop ? "50%" : "90%"}
        padding="2rem"
        margin="2rem auto"
        borderRadius="1.3rem"
        backgroundColor={theme.palette.background.alt}
        boxShadow = {"5px 5px 10px #ccc"}
        sx={{
          ":hover":{
            boxShadow: "10px 10px 20px #ccc"
          }
        }}
      >
        <Typography textAlign="center" fontWeight="500" variant="h3" sx={{ mb: "1.75rem" }}>Edit Details</Typography>
        <EditProfileForm />
      </Box>
    </>
  );
};

export default EditProfile;