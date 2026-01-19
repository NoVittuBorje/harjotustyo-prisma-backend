import { Box, Button, Typography } from "@mui/material";
import stringToColor from "../utils/StringtoColor";
import { useNavigate } from "react-router";

const ChatMessageItem = ({ item }) => {
  const navigate = useNavigate();
  return (
    <Typography sx={{ wordBreak: "break-word" }}>
      <Button
        className={"button"}
        style={{ borderRadius: 50, color: stringToColor(item.author.username) }}
        size="small"
        variant="text"
        onClick={() => navigate(`/profile/${item.author.id}`)}
        color="inherit"
      >
        u/{item.author.username}
      </Button>
      : {item.content}
    </Typography>
  );
};
export default ChatMessageItem;
