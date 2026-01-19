import { Box, Button, FormGroup, TextField } from "@mui/material";
import { useState } from "react";

const ChatForm = ({ onSubmit, User }) => {
  const [content, setContent] = useState("");
  if (!User) return;
  return (
    <FormGroup sx={{ border: "1px solid white", borderRadius: 2, padding: 1 }}>
      <TextField
        required
        value={content}
        multiline
        color="inherit"
        inputProps={{ style: { color: "inherit" } }}
        variant="standard"
        InputLabelProps={{ style: { color: "inherit" } }}
        onChange={(event) => setContent(event.target.value)}
      />
      <Box sx={{ display: "flex", paddingTop: 1, justifyContent: "end" }}>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          className={"button"}
          style={{ borderRadius: 50 }}
          onClick={() => {
            onSubmit({ content: content });
            setContent("");
          }}
        >
          send
        </Button>
      </Box>
    </FormGroup>
  );
};

export default ChatForm;
