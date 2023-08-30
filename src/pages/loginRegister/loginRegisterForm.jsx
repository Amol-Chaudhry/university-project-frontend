import {Box, Button, TextField, Link, useTheme , useMediaQuery, CircularProgress, Typography} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo, setChatSecret } from "../../data/store";
import { Formik } from "formik"; // For Building forms, reference: https://www.npmjs.com/package/formik
import * as yup from "yup"; //For validations, reference: https://www.npmjs.com/package/yup
import axios from 'axios'; //For sending api requests, reference: https://www.npmjs.com/package/axios

//Validations for Sign Up form.
const signUpValidations = yup.object().shape({
  firstName: yup.string().required("required").max(150, "First Name should not exceed 150 characters."),
  lastName: yup.string().required("required").max(150, "Last Name should not exceed 150 characters."),
  userName: yup.string().required("required").min(2, "User Name should be at least 2 characters.").max(150, "User Name should not exceed 150 characters"),
  email: yup.string().email("Invalid email").required("required").matches(/@student\.bham\.ac\.uk$/i, "Invalid student email"),
  password: yup.string().required("required").min(6, "Password should be at least 6 characters."),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("required"),
  courseTitle: yup.string().required("required"),
});

//Validations for Sign In form.
const signInValidations = yup.object().shape({
  email: yup.string().email("Invalid email").required("required").matches(/@student\.bham\.ac\.uk$/i, "Invalid student email"),
  password: yup.string().required("required").min(6, "Invalid password."),
});

//Initial values for sign in form.
const signInValuesInitial = {
  email: "",
  password: "",
};

//Initial values for sign Up form.
const signUpValuesInitial = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
  courseTitle: "",
};

//Form component, used in Login and Register Pages.
const LoginRegisterForm = () => {

  //State for changing form.
  const [form, setForm] = useState("signIn");
  const isSignIn = (form === "signIn");
  const isSignUp = (form === "signUp");

  //Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Theme.
  const { palette } = useTheme();

  //API response.
  const [apiError, setApiError] = useState("");

  //For Loader.
  const [isLoading, setLoading] = useState(false);
  
  //Media query.
  const isDesktop = useMediaQuery("(min-width: 576px)");

  //Error Handler
  const handleError = (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 400)) {
      setApiError(error.response.data.error);
    } else {
      setApiError("Something went wrong! Please try again after some time.");
    }
  }

  //Handles sign In API call.
  const signIn = async (values, onSubmitProps) => {
    setLoading(true);
    axios.post(`${process.env.REACT_APP_SERVER_API_URL}/auth/signin`, values).then(
      response => {
        const responseData = response.data;
        onSubmitProps.resetForm();

        if (responseData) {
          dispatch(
            setUserInfo({
                userInfo: {Id: responseData.id,
                        email: responseData.email,
                        firstName: responseData.firstName,
                        lastName: responseData.lastName,
                         userName: responseData.userName,
                  courseTitle: responseData.courseTitle,
                  profilePictureUrl: responseData.profilePictureUrl,
                  coverPictureUrl: responseData.coverPictureUrl,
                  socialMedia: responseData.socialMedia,
                  about: responseData.about,
                  userAccessToken: responseData.token}
            })
          );
          
          dispatch(setChatSecret({ chatSecret: values.password  }));
          navigate("/home");
        }
      }
    ).catch(error => {
      handleError(error);
    })      
    .finally(() => {
      setLoading(false);
    });
  };

  //Handles sign Up API call.
  const signUp = (values, onSubmitProps) => {
    setLoading(true);

    axios.post(`${process.env.REACT_APP_SERVER_API_URL}/auth/signup`, values)
      .then(response => {
        const responseData = response.data;
  
        onSubmitProps.resetForm();
        if (responseData) {
          setForm("signIn");
          setApiError("");
        }
      })
      .catch(error => {
        handleError(error);
      })      
      .finally(() => {
        setLoading(false);
      });
  };

  //Form submit handler.
  const handleSubmit = async (values, onSubmitProps) => {
    if (isSignUp) await signUp(values, onSubmitProps);
    if (isSignIn) await signIn(values, onSubmitProps);
  };

  return (
    <Formik onSubmit={handleSubmit} validationSchema={isSignUp ? signUpValidations: signInValidations } initialValues={isSignIn ? signInValuesInitial : signUpValuesInitial}>
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm
      }) => (
        <form onSubmit={handleSubmit}>
          
          <Typography textAlign="center" fontWeight="500" variant="h4" sx={{ mb: "1.5rem" }}>
            {isSignUp ? "Create your account" : "Log in to your account"}
          </Typography>
          
          <Box gap="22px" display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" 
            sx={{"& > div": { gridColumn: isDesktop ? undefined : "span 2" } }}
          >
            {isSignUp && 
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.userName}
                  name="userName"
                  error={Boolean(touched.userName) && Boolean(errors.userName)}
                  helperText={touched.userName && errors.userName}
                  sx={{ gridColumn: "span 2" }}
                />
              </>               
            }
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{borderRadius: "1px",  gridColumn: "span 2"}}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{  gridColumn: isSignIn? "span 2": "span 1" }}
            />
            {isSignUp &&
              <>
                <TextField
                  label="Confirm Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  name="confirmPassword"
                  error={Boolean(touched.confirmPassword) && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  label="Course Title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.courseTitle}
                  name="courseTitle"
                  error={Boolean(touched.courseTitle) && Boolean(errors.courseTitle)}
                  helperText={touched.courseTitle && errors.courseTitle}
                  sx={{ gridColumn: "span 2" }}
                />
              </>
            }
          </Box>
          <>
            <Button
              fullWidth
              type="submit"
              style={{ borderRadius: 35}}
              disabled={isLoading}
              sx={{
                m: "2rem 0 2rem",
                p: "0.75rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main }
              }}
            >
              {isLoading ? (<CircularProgress size={24} color="inherit" />) : (isSignIn ? "LOGIN" : "REGISTER")}
            </Button>

            {apiError && (<p style={{ color: "red", marginBottom: "1rem" }}>{apiError}</p>)}

            <Link href="#" 
                  underline="none"
                  onClick={() => {
                    setForm(isSignIn ? "signUp" : "signIn");
                    setApiError("");
                    resetForm();
                  }}
                  sx={{
                    color: "#3C8FB7",
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    }
                  }}
            >
              {isSignIn ? "New user? Sign up now." : "Have an existing account? Log in here."}
            </Link>
          </>
        </form>
      )}
    </Formik>
  );
};

export default LoginRegisterForm;