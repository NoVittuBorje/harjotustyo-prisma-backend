import {
  Box,
  Button,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

const EditFieldItem = ({ valueType, value, handleSave }) => {
  const [open, setOpen] = useState(false);
  const [fieldvalue, setValue] = useState(value);
  const EditState = () => {
    if (open) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack>
            <TextField
              color="primary"
              sx={{ m: 1 }}
              inputProps={{ style: { color: "inherit" } }}
              variant="standard"
              InputLabelProps={{ style: { color: "inherit" } }}
              value={fieldvalue}
              onChange={(event) => setValue(event.target.value)}
              label={valueType}
            ></TextField>
            <Box>
              <Button
                className={"button"}
                style={{ borderRadius: 50 }}
                size="small"
                variant="outlined"
                color="inherit"
                onClick={() => {
                  handleSave({ content: fieldvalue, type: valueType });
                  setOpen(!open);
                }}
              >
                save
              </Button>

              <Button
                className={"button"}
                style={{ borderRadius: 50 }}
                size="small"
                variant="outlined"
                color="inherit"
                onClick={() => setOpen(!open)}
              >
                cancel
              </Button>
            </Box>
          </Stack>
        </Box>
      );
    } else {
      return (
        <Box
          padding={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <Tooltip followCursor={true} title={value}>
              <Typography
                maxWidth={400}
                className="feedDesc"
              >{`${valueType}: ${value}`}</Typography>
            </Tooltip>
          </Box>
          <Button
            className={"button"}
            style={{ borderRadius: 50 }}
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => setOpen(!open)}
          >
            edit
          </Button>
        </Box>
      );
    }
  };
  return <Box sx={{ borderTop: 1 }}>{EditState()}</Box>;
};
export default EditFieldItem;
