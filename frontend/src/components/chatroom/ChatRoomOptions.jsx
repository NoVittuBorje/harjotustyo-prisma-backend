import {
  Autocomplete,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import useEditChatRoom from "../hooks/useEditChatRoom";

const ChatRoomOptions = ({ User, info,CloseMenu }) => {
  const [SelectedUser, setSelectedUser] = useState();
  const [editroom] = useEditChatRoom();
  const avoidBubblingUp = (e) => {
    e.stopPropagation();
  };
  const OwnerOptions = () => {
    if (User.id === info.owner.id) {
      return (
        <>
          <Autocomplete
            disablePortal
            value={SelectedUser || null}
            size="small"
            sx={{ width: "25%" }}
            options={users ? users : []}
            getOptionLabel={(option) => `${option.username}`}
            getOptionKey={(option) => option.username}
            renderOption={(params, option) => (
              <Typography {...params}>{option.username}</Typography>
            )}
            onKeyDown={avoidBubblingUp}
            renderInput={(params) => (
              <TextField
                sx={{
                  input: { color: "inherit" },
                  label: { color: "inherit" },
                }}
                size="small"
                {...params}
                label="Users"
                required
              />
            )}
            onChange={(event, newValue) => {
              setSelectedUser(newValue);
            }}
          />
          <Button
            className="button"
            sx={{ borderRadius: 50 }}
            onClick={() => {
              editroom({
                roomId: info.id,
                type: "kick",
                content: SelectedUser.id,
              });
            }}
            size="small"
            variant="outlined"
            color="inherit"
          >
            Kick User
          </Button>
        </>
      );
    }
    return;
  };
  const users = info ? info.users : [];
  return (
    <Stack direction={"row"} sx={{ display: "flex" }}>
      <Button
        className="button"
        sx={{ borderRadius: 50 }}
        onClick={() => {
          const data = editroom({
            roomId: info.id,
            type: "leaveroom",
          });
          CloseMenu()
        }}
        size="small"
        variant="outlined"
        color="inherit"
      >
        Leave Room
      </Button>
      <OwnerOptions></OwnerOptions>
    </Stack>
  );
};
export default ChatRoomOptions;
