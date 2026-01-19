import {
  Box,
  Button,
  FormGroup,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import * as React from "react";
import useLogin from "../../hooks/useLogin";
import { Link, useNavigate } from "react-router";

const LoginPage = ({ refetch }) => {
  const navigate = useNavigate();
  const [login] = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);
  const [Username, setUsername] = React.useState("");
  const [Password, setPassword] = React.useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleFormSubmit = async () => {
    try {
      const data = await login({ Username, Password });

      if (data.data.login.value) {
        refetch();
        navigate("/");
      }
    } catch (error) {
      setUsernameError(false);
      setUsernameErrorMsg(null);
      setPasswordError(false);
      setPasswordErrorMsg(null);
      if (error.message == "Wrong Username!") {
        setUsernameErrorMsg(error.message);
        setUsernameError(true);
      }

      if (error.message == "Wrong Password!") {
        setPasswordErrorMsg(error.message);
        setPasswordError(true);
      }
    }
  };
  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMsg, setUsernameErrorMsg] = React.useState(null);
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = React.useState(null);
  return (
    <Grid container rowSpacing={1} sx={{ flexDirection: "row" }}>
      <Grid size={{ xs: 12, md: 4, sm: 2 }}></Grid>
      <Grid size={{ xs: 12, md: 4, sm: 8 }}>
        <Box>
          <Box sx={{ borderRadius: 3, boxShadow: 3, padding: 3 }}>
            <FormGroup
              sx={{
                alignItems: "center",
                verticalAlign: "center",
                marginTop: 1,
              }}
            >
              <Typography variant="h5">Login</Typography>
              <TextField
                id="username"
                sx={{ m: 0.5, width: "30ch" }}
                label="Username"
                variant="outlined"
                onChange={(event) => setUsername(event.target.value)}
                error={usernameError}
                helperText={usernameErrorMsg ? usernameErrorMsg : ""}
              />

              <FormControl
                sx={{ m: 0.5, width: "30ch" }}
                error={passwordError}
                variant="outlined"
              >
                <InputLabel htmlFor="password">Password</InputLabel>

                <OutlinedInput
                  id="password"
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />

                <FormHelperText>
                  {passwordErrorMsg ? passwordErrorMsg : ""}
                </FormHelperText>
              </FormControl>
              <Button
                sx={{ borderRadius: 50 }}
                className="button"
                color="inherit"
                onClick={handleFormSubmit}
                variant="contained"
              >
                Log in
              </Button>
              <Box sx={{ paddingX: 2 }}>
                <Typography>If you have no account</Typography>
                <Typography>
                  <Link to="/register">register by clicking this</Link>
                </Typography>
              </Box>
            </FormGroup>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 4, sm: 2 }}></Grid>
    </Grid>
  );
};
export default LoginPage;
