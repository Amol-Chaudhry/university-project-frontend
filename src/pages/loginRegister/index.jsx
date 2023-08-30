import { Box, Typography, useTheme} from "@mui/material";
import LoginRegisterForm from "./loginRegisterForm";

// Navbar for Login/Register Pages.
const LoginRegisterPageNavbar = () => {
  const theme = useTheme();

  return (
    <Box p = "0.5rem 0%" width="100%" backgroundColor={theme.palette.background.alt} textAlign="center">
      <Typography fontSize="30px" sx={{ fontFamily: 'Pacifico' }}  color="primary">BhamConnect</Typography>
    </Box>
  );
};

// Login/Register Pages.
const LoginRegisterPage = () => {
  const theme = useTheme();

  return (
    <>
      <LoginRegisterPageNavbar/>

      <Box
        maxWidth={415}
        p="2rem"
        mt="3rem"
        mb="2rem"
        mx="auto"
        width = "92%"
        borderRadius="1.3rem"
        backgroundColor={theme.palette.background.alt}
        boxShadow = {"5px 5px 10px #ccc"}
        sx={{
          ":hover":{
            boxShadow: "10px 10px 20px #ccc"
          }
        }}
      >
        <LoginRegisterForm />
      </Box>
    </>
  );
};

export default LoginRegisterPage;