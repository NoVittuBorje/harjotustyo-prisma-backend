import { FormGroup, TextField, Button, Box } from "@mui/material";
import { useState } from "react";

const NewComment = ({ handleReply, commentid, handleReplyClick }) => {
  const [comment, setComment] = useState("");
  const handleNewReply = (event) => {
    event.preventDefault();
    handleReply({
      content: comment,
      commentid,
    });
  };
  return (
    <FormGroup>
      <TextField
        required
        value={comment}
        multiline
        variant="standard"
        inputProps={{ style: { color: "inherit" } }}
        onChange={(event) => setComment(event.target.value)}
      />
      <Box sx={{ display: "flex", paddingTop: 1 }}>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          className={"button"}
          style={{ borderRadius: 50, backgroundColor: "background.button" }}
          onClick={(event) => {
            handleNewReply(event);
          }}
        >
          reply
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          className={"button"}
          style={{ borderRadius: 50, backgroundColor: "background.button" }}
          onClick={handleReplyClick}
        >
          cancel
        </Button>
      </Box>
    </FormGroup>
  );
};
export default NewComment;
