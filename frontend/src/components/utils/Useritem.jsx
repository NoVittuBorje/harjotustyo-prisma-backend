import {  Box, Button, Typography } from "@mui/material";
import Timestamp from "./Timestamp";
import { useNavigate } from "react-router";
import UserAvatar from "./UserAvatar";
const Useritem = ({ user, time, edittime }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 0,
        marginBottom: 1,
      }}
    >
      
      <UserAvatar width={40} height={40} user={user}></UserAvatar>
      
      <Button size="small" color="inherit" className="button" sx={{ borderRadius: 50 }}>
        <Typography
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/profile/${user.id}`);
          }}
          color="inherit"
          variant="h8"
          underline="none"
        >{`u/${user.username}`}</Typography>
      </Button>
      <Timestamp time={time} edittime={edittime}></Timestamp>
    </Box>
  );
};
export default Useritem;
