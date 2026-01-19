import { Box } from "@mui/material";
import Editor from "react-simple-wysiwyg";

function TextEditor({ html, setHtml }) {
  function onChange(e) {
    setHtml(e.target.value);
  }

  return (
    <Box sx={{ minWidth: 200 }}>
      <Editor style={{ width: "100%" }} value={html} onChange={onChange} />
    </Box>
  );
}
export default TextEditor;
