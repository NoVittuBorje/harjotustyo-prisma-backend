import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import KarmaItem from "./KarmaItem";
import Useritem from "./Useritem";
import SettingsIcon from "@mui/icons-material/Settings";
import parse from "html-react-parser";
import { useState } from "react";
import PostModSettings from "../pages/singlepostpage/PostModSettings";
import useGetImageUrl from "../hooks/useGetImageUrl";
import Locked from "./Locked";
import PostCommentItem from "./PostCommentItem";

const FeedItem = ({ item, owner, User, mods, setmessage, setseverity }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const ModSettings = () => {
    if (!mods | !User) {
      return;
    }
    if (mods.includes(User.id))
      return (
        <IconButton
          onClick={() => {
            setOpen(!open);
          }}
        >
          <SettingsIcon></SettingsIcon>
        </IconButton>
      );
  };
  const FeedImage = ({ img }) => {
    const { data, loading } = useGetImageUrl({ imageId: img });
    if (!loading) {
      return (
        <img
          src={data.getImage}
          style={{ maxHeight: 500, maxWidth: "100%", borderRadius: 15 }}
        ></img>
      );
    }
  };
  const FeedDescription = ({ item }) => {
    if (item.img) {
      return (
        <Box key={`${item.id}imagedescription`} className="imagecontainer">
          <FeedImage img={item.img}></FeedImage>
        </Box>
      );
    } else {
      return (
        <Box key={`${item.id}description`} className="feedDesc">
          {parse(item.description)}
        </Box>
      );
    }
  };
  return (
    <Box key={`feeditem${item.id}`}>
      <Box
        className={"feed"}
        sx={{
          boxShadow: 3,
          backgroundColor: "background.dark",
          "&:hover": {
            backgroundColor: "background.hover",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            onClick={() => {
              navigate(`/post/${item.id}`);
            }}
            sx={{ flexDirection: "column", padding: 1 }}
          >
            <Useritem time={item.createdAt} user={owner}></Useritem>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  marginBottom: 1,
                }}
              >
                <Typography variant="h5">{`${item.headline}`}</Typography>
                <Button
                  size="small"
                  color="inherit"
                  className="button"
                  sx={{ borderRadius: 50 }}
                >
                  <Typography
                    color="inherit"
                    variant="h8"
                    underline="none"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/feed/${item.feed.feedname}`);
                    }}
                  >
                    {`f/${item.feed.feedname}`}
                  </Typography>
                </Button>
                <Locked locked={item.locked}></Locked>
              </Box>
              <FeedDescription item={item}></FeedDescription>
            </Box>
          </Box>

          <Box className={"footer"}>
            <KarmaItem
              setmessage={setmessage}
              setseverity={setseverity}
              type={"post"}
              karma={item.karma}
              id={item.id}
              User={User}
            ></KarmaItem>
            <PostCommentItem comments={item.commentsCount}></PostCommentItem>

            <ModSettings></ModSettings>
          </Box>

          <Collapse in={open}>
            <Divider></Divider>
            <PostModSettings item={item}></PostModSettings>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
};
export default FeedItem;
