import { Box, Grid, Stack } from "@mui/system";
import {
  CircularProgress,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import ProfileFeedComment from "./ProfileFeedComment";
import ProfileFeedOwnedFeeds from "./ProfileFeedOwnedFeeds";
import ProfileFeedPosts from "./ProfileFeedPosts";
import ProfileFeedSubs from "./ProfileFeedSubs";
import { useState } from "react";
import useGetUser from "../../hooks/useGetUser";
import UserAvatar from "../../utils/UserAvatar";
import parse from "html-react-parser";
import formatNumber from "../../utils/FormatNumber";
import numbertoColor from "../../utils/NumbertoColor";

const ProfileFeed = ({ type, id, userdata, User, setmessage, setseverity }) => {
  const variables = {
    id: id,
  };

  if (type === "posts") {
    return (
      <Box key={"profileposts"}>
        <ProfileFeedPosts
          variables={variables}
          setmessage={setmessage}
          setseverity={setseverity}
          userdata={userdata}
          User={User}
        ></ProfileFeedPosts>
      </Box>
    );
  }
  if (type === "comments") {
    return (
      <Box key={"profilecomments"}>
        <ProfileFeedComment
          setmessage={setmessage}
          setseverity={setseverity}
          variables={variables}
          userdata={userdata}
          User={User}
        ></ProfileFeedComment>
      </Box>
    );
  }
  if (type === "ownedfeeds") {
    return (
      <Box key={"profileownedfeeds"}>
        <ProfileFeedOwnedFeeds
          variables={variables}
          userdata={userdata}
        ></ProfileFeedOwnedFeeds>
      </Box>
    );
  }
  if (type === "subs") {
    return (
      <Box key={"profilesubs"}>
        <ProfileFeedSubs
          variables={variables}
          userdata={userdata}
        ></ProfileFeedSubs>
      </Box>
    );
  }
  return;
};
const Profilepage = ({ User, match, setmessage, setseverity }) => {
  const [type, setType] = useState("posts");
  const id = match.params.userid;
  const userdata = useGetUser({ id: id });
  const handleChange = (event) => {
    setType(event.target.value);
  };

  if (userdata.loading) {
    return <CircularProgress></CircularProgress>;
  } else {
    const profiledata = userdata.data ? userdata.data.getuser : [];

    const ProfileDesc = ({ profiledata }) => {
      if (profiledata.description) {
        return <Box key={"ProfileDesc"}>{parse(profiledata.description)}</Box>;
      } else {
        return;
      }
    };
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={1} sx={{ flexDirection: "row" }}>
          <Grid size={{ xs: 12, md: 2 }} sx={{}}></Grid>
          <Grid size={{ xs: 12, md: 8 }} sx={{}}>
            <Box sx={{ padding: 1 }}>
              <Grid
                sx={{
                  paddingBottom: 5,
                  flexDirection: "row",
                  justifyItems: "center",
                  justifyContent: "space-between",
                }}
                container
              >
                <Grid>
                  <Stack direction={"column"} sx={{ justifyContent: "center" }}>
                    <Typography variant="h4">{profiledata.username}</Typography>
                    <UserAvatar
                      height={100}
                      width={100}
                      user={profiledata}
                    ></UserAvatar>
                    <Box sx={{ justifyContent: "center" }}>
                      <Tooltip title={profiledata.userKarma}>
                        <Typography
                          color={numbertoColor(profiledata.userKarma)}
                        >{`Karma: ${formatNumber(
                          profiledata.userKarma
                        )}`}</Typography>
                      </Tooltip>
                    </Box>
                  </Stack>
                </Grid>

                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                >
                  <Typography>{`Disliked posts: ${
                    profiledata.dislikedposts
                      ? profiledata.dislikedposts.length
                      : "0"
                  }`}</Typography>
                  <Typography>{`Disliked comments: ${
                    profiledata.dislikedcomments
                      ? profiledata.dislikedcomments.length
                      : "0"
                  }`}</Typography>
                  <Typography>{`Subs:  ${
                    profiledata.feedsubs ? profiledata.feedsubs.length : "0"
                  }`}</Typography>
                </Grid>
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography>{`Liked posts: ${
                    profiledata.likedposts ? profiledata.likedposts.length : "0"
                  }`}</Typography>
                  <Typography>{`Liked comments: ${
                    profiledata.likedcomments
                      ? profiledata.likedcomments.length
                      : "0"
                  }`}</Typography>
                  <Typography>{`Owned feeds: ${
                    profiledata.ownedfeeds ? profiledata.ownedfeeds.length : "0"
                  }`}</Typography>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12 }} container flexDirection={"row"}></Grid>
              <Grid></Grid>
              <Divider></Divider>

              <ProfileDesc profiledata={profiledata}></ProfileDesc>

              <Divider></Divider>
            </Box>
            <Box sx={{ padding: 1 }}>
              <FormControl>
                <Select
                  defaultValue={"posts"}
                  name="select-info"
                  id="select-info"
                  size="small"
                  sx={{ color: "inherit" }}
                  onChange={handleChange}
                >
                  <Typography key={"sortby"} sx={{ paddingLeft: 2 }}>
                    Sort by
                  </Typography>
                  <MenuItem key={"posts"} value={"posts"}>
                    Posts
                  </MenuItem>
                  <MenuItem key={"subs"} value={"subs"}>
                    Subs
                  </MenuItem>
                  <MenuItem key={"comments"} value={"comments"}>
                    Comments
                  </MenuItem>
                  <MenuItem key={"ownedfeeds"} value={"ownedfeeds"}>
                    Owned feeds
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Divider></Divider>
            <Box key={"ProfileFeed"}>
              <ProfileFeed
                id={profiledata.id}
                User={User}
                userdata={userdata.data.getuser}
                type={type}
                setmessage={setmessage}
                setseverity={setseverity}
              ></ProfileFeed>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }} sx={{}}></Grid>
        </Grid>
      </Box>
    );
  }
};

export default Profilepage;
