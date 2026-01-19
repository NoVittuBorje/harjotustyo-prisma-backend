import { FormGroup, TextField, Button, Box } from "@mui/material";
import { useState } from "react";

const EditComment = ({ onReply, commentid, oldcomment, handleEditClick }) => {
  const [comment, setComment] = useState(oldcomment);
  return (
    <FormGroup>
      <TextField
        required
        value={comment}
        multiline
        inputProps={{ style: { color: "inherit" } }}
        variant="standard"
        onChange={(event) => setComment(event.target.value)}
      />
      <Box sx={{ display: "flex", paddingTop: 1 }}>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          className={"button"}
          style={{ borderRadius: 50, backgroundColor: "background.button" }}
          onClick={() => {
            onReply({ content: comment, commentid, action: "edit" });
            handleEditClick();
          }}
        >
          save
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          className={"button"}
          style={{ borderRadius: 50, backgroundColor: "background.button" }}
          onClick={handleEditClick}
        >
          cancel
        </Button>
      </Box>
    </FormGroup>
  );
};
export default EditComment;
