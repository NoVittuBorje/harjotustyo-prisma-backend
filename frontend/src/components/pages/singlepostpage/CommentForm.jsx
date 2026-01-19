import { Box, Button, FormGroup, TextField } from "@mui/material";
import { useState } from "react";

const CommentForm = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  return (
    <FormGroup sx={{}}>
      <TextField
        required
        value={content}
        multiline
        label="new comment"
        color="inherit"
        inputProps={{ style: { color: "inherit" } }}
        variant="standard"
        InputLabelProps={{style:{color:"inherit"}}}
        onChange={(event) => setContent(event.target.value)}
      />
      <Box sx={{ display: "flex", paddingTop: 1 }}>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          className={"button"}
          style={{ borderRadius: 50 }}
          onClick={() => {
            onSubmit({ content: content });
          }}
        >
          send
        </Button>
      </Box>
    </FormGroup>
  );
};

export default CommentForm;
