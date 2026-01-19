import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import useMakeNewChatRoom from "../hooks/useMakeChatRoom";
import useEditChatRoom from "../hooks/useEditChatRoom";

const ChatOptions = ({ User, CloseMenu }) => {
  const [makechatroom] = useMakeNewChatRoom();
  const [editroom] = useEditChatRoom();
  const [ChatName, setChatName] = useState("");
  const [SelectedChat, setSelectedChat] = useState();

  const [SelectedChangeChat, setSelectedChangeChat] = useState();
  const [ChangeChatName, setChangeChatName] = useState("");
  const avoidBubblingUp = (e) => {
    e.stopPropagation();
  };

  return (
    <Stack rowGap={1} padding={1}>
      <Box
        sx={{
          border: "1px solid",
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          padding: 1,
          alignItems: "center",
        }}
      >
        <TextField
          color="primary"
          sx={{ m: 1 }}
          inputProps={{ style: { color: "inherit" } }}
          variant="standard"
          InputLabelProps={{ style: { color: "inherit" } }}
          value={ChatName}
          onChange={(event) => setChatName(event.target.value)}
          label={"Name of new chat room"}
          required
        ></TextField>
        <Button
          className="button"
          sx={{ borderRadius: 50 }}
          onClick={() => {
            makechatroom({ name: ChatName, feedId: "", type: "group" });
            CloseMenu();
          }}
          size="small"
          variant="outlined"
          color="inherit"
        >
          make chat room
        </Button>
      </Box>
      <Divider></Divider>
      <Box
        sx={{
          border: "1px solid",
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          padding: 1,
          alignItems: "center",
          minWidth: "100%",
        }}
      >
        <Autocomplete
          disablePortal
          value={SelectedChat || null}
          sx={{ minWidth: "100%" }}
          options={User ? User.chatrooms : []}
          getOptionLabel={(option) => `${option.name}`}
          getOptionKey={(option) => option.name}
          renderOption={(params, option) => (
            <Typography {...params}>{option.name}</Typography>
          )}
          onKeyDown={avoidBubblingUp}
          renderInput={(params) => (
            <TextField
              sx={{
                minWidth: "90%",
                input: { color: "inherit" },
                label: { color: "inherit" },
              }}
              size="small"
              {...params}
              label="Your rooms"
              required
            />
          )}
          onChange={(event, newValue) => {
            setSelectedChat(newValue);
          }}
        />

        <Button
          className="button"
          sx={{ borderRadius: 50 }}
          onClick={() => {
            editroom({
              roomId: SelectedChat.id,
              type: "leaveroom",
              feedId: "",
            });
            CloseMenu();
          }}
          size="small"
          variant="outlined"
          color="inherit"
        >
          leave chat
        </Button>
      </Box>

      <Divider></Divider>
      <Box
        sx={{
          border: "1px solid",
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          padding: 1,
          alignItems: "center",
          minWidth: "100%",
        }}
      >
        <Autocomplete
          disablePortal
          value={SelectedChangeChat || null}
          sx={{ minWidth: "100%" }}
          options={User ? User.chatrooms : []}
          getOptionLabel={(option) => `${option.name}`}
          getOptionKey={(option) => option.name}
          renderOption={(params, option) => (
            <Typography {...params}>{option.name}</Typography>
          )}
          onKeyDown={avoidBubblingUp}
          renderInput={(params) => (
            <TextField
              sx={{
                minWidth: "90%",
                input: { color: "inherit" },
                label: { color: "inherit" },
              }}
              size="small"
              {...params}
              label="Your rooms"
              required
            />
          )}
          onChange={(event, newValue) => {
            setSelectedChangeChat(newValue);
            setChangeChatName(newValue.name);
          }}
        />

        <TextField
          color="primary"
          sx={{ m: 1, minWidth: "100%" }}
          inputProps={{ style: { color: "inherit" } }}
          variant="outlined"
          InputLabelProps={{ style: { color: "inherit" } }}
          value={ChangeChatName}
          onChange={(event) => setChangeChatName(event.target.value)}
          label={"New name"}
          required
          onKeyDown={avoidBubblingUp}
        ></TextField>
        <Button
          className="button"
          sx={{ borderRadius: 50 }}
          onClick={() => {
            editroom({
              roomId: SelectedChangeChat.id,
              type: "changename",
              content: ChangeChatName,
            });
            CloseMenu();
          }}
          size="small"
          variant="outlined"
          color="inherit"
        >
          Change name
        </Button>
      </Box>
    </Stack>
  );
};
export default ChatOptions;
