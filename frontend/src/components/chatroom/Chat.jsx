import { useState } from "react";
import ChatItem from "./ChatItem";
import { Box, Button } from "@mui/material";
import ExpandIcon from "../utils/ExpandIcon";
import ForumIcon from "@mui/icons-material/Forum";
import ChatOptions from "./ChatOptions";
import ChatRoomOptions from "./ChatRoomOptions";
import useGetChatRoomInfo from "../hooks/useGetChatRoomInfo";
const Chatroom = ({User,CloseMenu,type,roomId,headline}) => {
  const { data, loading } = useGetChatRoomInfo({ roomId: roomId });
  if(loading){
    return
  }
  return(
      <Box sx={{ height: "auto" }}>
        <ChatRoomOptions
          User={User}
          info={data ? data.getChatRoomInfo : []}
          CloseMenu={CloseMenu}
        ></ChatRoomOptions>
        <ChatItem
          type={type}
          roomId={roomId}
          headline={headline}
          User={User}
          size={{ width: "auto", maxWidth: "auto", height: 200 }}
        ></ChatItem>
      </Box>
  )
}
const Chat = ({ type, roomId, headline, User, CloseMenu }) => {
  const [Open, setOpen] = useState(false);


  if (type == "feed") {
    if (Open) {
      return (
        <Box
          sx={{
            border: "1px solid",
            borderRadius: 5,
            padding: 1,
            display: "flex",
            flexDirection: "column",
            width: "60%",
          }}
        >
          <Button
            className={"button"}
            style={{ borderRadius: 50 }}
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => setOpen(!Open)}
          >
            <ForumIcon></ForumIcon>Close {headline} Chat{" "}
            <ExpandIcon Open={Open}></ExpandIcon>
          </Button>
          <ChatItem
            type={type}
            roomId={roomId}
            headline={headline}
            User={User}
            size={{ width: "auto", maxWidth: "auto", height: 200 }}
          ></ChatItem>
        </Box>
      );
    } else {
      return (
        <Button
          className={"button"}
          style={{ borderRadius: 50 }}
          size="small"
          variant="outlined"
          color="inherit"
          onClick={() => setOpen(!Open)}
        >
          <ForumIcon></ForumIcon>Open {headline} Chat{" "}
          <ExpandIcon Open={Open}></ExpandIcon>
        </Button>
      );
    }
  }
  if (type == "chatroom") {
    return (
      <Chatroom User={User} CloseMenu={CloseMenu} type={type} roomId={roomId} headline={headline} ></Chatroom>
    );
  }
  if (type == "makechatroom") {
    return (
      <Box sx={{ width: "auto", height: "auto", borderRadius: 5 }}>
        <ChatOptions User={User} CloseMenu={CloseMenu}></ChatOptions>
      </Box>
    );
  }
};
export default Chat;
