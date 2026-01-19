import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import useGetFeed from "../../hooks/useGetFeed";
import { useNavigate } from "react-router";
import FeedItem from "../../utils/FeedItem";
import useSubscribe from "../../hooks/useSubscribe";
import InfiniteScroll from "react-infinite-scroll-component";
import useGetFeedPosts from "../../hooks/useGetFeedPosts";
import { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import AddBoxIcon from "@mui/icons-material/AddBox";
import UserAvatar from "../../utils/UserAvatar";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import parse from "html-react-parser";

import useEditFeed from "../../hooks/useEditFeed";
import EditFeedDesc from "./EditFeedDesc";
import FeedModSettings from "./FeedModSettings";
import FeedAvatar from "../../utils/FeedAvatar";
import ExpandIcon from "../../utils/ExpandIcon";
import Timestamp from "../../utils/Timestamp";
import ChatItem from "../../chatroom/ChatItem";
import Chat from "../../chatroom/Chat";

const FeedPage = ({ match, User, refetchUser, setmessage, setseverity }) => {
  if (!localStorage.getItem("FeedorderBy")) {
    localStorage.setItem("FeedorderBy", "POPULAR");
  }
  const [orderBy, setorderBy] = useState(localStorage.getItem("FeedorderBy"));

  useEffect(() => {
    setorderBy(localStorage.getItem("FeedorderBy"));
  }, []);

  useEffect(() => {
    localStorage.setItem("FeedorderBy", orderBy);
  }, [orderBy]);

  const feedname = match.params.feedname;
  const variables = {
    orderBy: orderBy,
    feedname: feedname,
  };

  const navigate = useNavigate();
  const feedinfo = useGetFeed({ feedname });
  const { data ,fetchMore  } =
    useGetFeedPosts(variables);
  const [editfeed] = useEditFeed();

  const [sub] = useSubscribe();
  const [OpenSettings, setOpenSettings] = useState(false);
  const [FeedEditOpen, setFeedEditOpen] = useState(false);
  const handleSave = async ({ content, feedid, action }) => {
    const data = await editfeed({
      content,
      feedid,
      action,
    });

    if (data.modifyFeed) {
      setFeedEditOpen(false);
    }
  };
  const handleorderByChange = (event) => {
    setorderBy(event.target.value);
  };
  const Subscribe = async ({ feedname, type }) => {
    await sub({ feedname, type });

    refetchUser();
    feedinfo.refetch();
  };

  const FeedInfo = ({ info, infoloading }) => {
    const [OpenModeratorShow, setOpenModeratorShow] = useState(false);
    if (infoloading) {
      return <CircularProgress color="inherit"></CircularProgress>;
    }
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.dark",
          borderRadius: 5,
          padding: 1,
          border: "1px solid",
        }}
      >
        <Stack spacing={1}>
          <Typography variant="h6">Feed info: </Typography>
          <Box sx={{ display: "flex" }}>
            <Typography>Owner:</Typography>
            <Button
              onClick={() => {
                navigate(`/profile/${info.owner.id}`);
              }}
              className="button"
              color="inherit"
              size="small"
              sx={{ borderRadius: 50 }}
            >
              <UserAvatar width={20} height={20} user={info.owner}></UserAvatar>

              {info.owner.username}
            </Button>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography>Created :</Typography>
            <Timestamp time={info.createdAt}></Timestamp>
          </Box>
          <Box>
            <Typography>Moderators:</Typography>
            <Button
              onClick={() => {
                setOpenModeratorShow(!OpenModeratorShow);
              }}
              className="button"
              color="inherit"
              size="small"
              sx={{ borderRadius: 50 }}
            >
              show {info.moderators.length}
              <ExpandIcon Open={OpenModeratorShow}></ExpandIcon>
            </Button>
          </Box>
          <Collapse in={OpenModeratorShow}>
            <Stack>
              {info.moderators.map((mod) => {
                return (
                  <Box>
                    <Button
                      onClick={() => {
                        navigate(`/profile/${mod.id}`);
                      }}
                      className="button"
                      color="inherit"
                      size="small"
                      sx={{ borderRadius: 50 }}
                    >
                      <UserAvatar
                        width={20}
                        height={20}
                        user={mod}
                      ></UserAvatar>{" "}
                      {mod.username}
                    </Button>
                  </Box>
                );
              })}
            </Stack>
          </Collapse>

          <Typography>Subs: {info.subs.length}</Typography>
        </Stack>
      </Box>
    );
  };
  const FeedDescription = ({ info, infoloading, FeedEditOpen }) => {
    if (infoloading) {
      return <CircularProgress color="inherit"></CircularProgress>;
    }
    if (FeedEditOpen) {
      return (
        <Box sx={{ padding: 1, display: "flex" }}>
          <Stack direction={"column"}>
            <Stack direction={"row"} alignItems={"center"} gap={2} padding={1}>
              <FeedAvatar width={100} height={100} feed={info}></FeedAvatar>
              <Typography variant="h5">{`f/${info.feedname}`}</Typography>
            </Stack>
            <FeedEdit info={info} User={User}></FeedEdit>
          </Stack>
        </Box>
      );
    }
    return (
      <Box sx={{ padding: 1, display: "flex" }}>
        <Stack direction={"column"}>
          <Stack direction={"row"} alignItems={"center"} gap={2} padding={1}>
            <FeedAvatar width={100} height={100} feed={info}></FeedAvatar>
            <Typography variant="h5">{`f/${info.feedname}`}</Typography>
          </Stack>
          <Box key={info.id}>{parse(info.description)}</Box>
        </Stack>
      </Box>
    );
  };
  const ModSettingIcon = ({ info, infoloading, User }) => {
    if (infoloading) {
      return;
    }
    const mods = [...info.moderators.map((mod) => mod.id), info.owner.id];
    if (!mods || !User) {
      return;
    }
    if (mods.includes(User.id)) {
      return (
        <IconButton
          className={"button"}
          sx={{ color: "inherit" }}
          onClick={() => setOpenSettings(!OpenSettings)}
        >
          <SettingsIcon></SettingsIcon>
        </IconButton>
      );
    } else {
      return;
    }
  };
  const FeedEdit = ({ info, User }) => {
    if (!info) {
      return;
    }
    const mods = [...info.moderators.map((mod) => mod.id), info.owner.id];
    if (!mods || !User) {
      return;
    }
    if (mods.includes(User.id)) {
      return (
        <Collapse in={FeedEditOpen}>
          <EditFeedDesc
            setOpen={setFeedEditOpen}
            handleSave={handleSave}
            feed={info ? info.description : null}
          ></EditFeedDesc>
        </Collapse>
      );
    } else {
      return;
    }
  };
  const SubButton = ({ User }) => {
    if (!User) {
      return;
    }
    if (!User.feedsubs.find((e) => e.feedname === feedname)) {
      return (
        <Box sx={{ verticalAlign: "middle" }}>
          <Button
            className={"button"}
            style={{ borderRadius: 50 }}
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => Subscribe({ feedname, type: "sub" })}
          >
            <AddCircleOutlineIcon></AddCircleOutlineIcon>
            Subscribe
          </Button>
        </Box>
      );
    } else {
      return (
        <Box sx={{ verticalAlign: "middle" }}>
          <Button
            className={"button"}
            style={{ borderRadius: 50 }}
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => Subscribe({ feedname, type: "unsub" })}
          >
            <RemoveCircleOutlineIcon></RemoveCircleOutlineIcon>
            unSubscribe
          </Button>
        </Box>
      );
    }
  };

  const NewPostButton = ({ User }) => {
    if (!User) {
      return;
    } else {
      return (
        <Box>
          <Button
            className={"button"}
            style={{ borderRadius: 50 }}
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => {
              navigate(`/newpost/${feedname}`);
            }}
          >
            <AddBoxIcon></AddBoxIcon>
            New Post
          </Button>
        </Box>
      );
    }
  };
  const FeedChat = ({ info, infoloading, User }) => {
    if (infoloading || !info.chatRoom) {
      return;
    }
    if(info.chatRoom.id){
    return (
      <Chat
        type={"feed"}
        headline={info.chatRoom.name}
        User={User}
        roomId={info.chatRoom.id}
      ></Chat>
    );}else{return}
  };
  const feed = data ? data.getfeedposts : [];
  let info = feedinfo.data ? feedinfo.data.getfeed : {};
  let infoloading = feedinfo.loading;
  info = info[0];
  let hasmore = true;

  if (feed.length % 10 != 0 || hasmore === false || feed.length == 0) {
    hasmore = false;
  }
  const loadmore = () => {
    if (feed.length % 10 == 0) {
      fetchMore({ offset: feed.length });
      hasmore = false;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid direction={"row"} container item spacing={0}>
        <Grid size={{ xs: 12, md: 2, sm: 1 }}></Grid>
        <Grid size={{ xs: 12, md: 8, sm: 12 }}>
          <Box direction={"row"} container>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
              size={{ xs: 2, md: 2, sm: 1 }}
            >
              <FeedDescription
                infoloading={infoloading}
                info={info}
                feed={feed}
                FeedEditOpen={FeedEditOpen}
              ></FeedDescription>

              <Box
                size={{ xs: 2, md: 2, sm: 1 }}
                sx={{ paddingTop: 2, display: "flex", flexDirection: "column" }}
              >
                <FeedInfo info={info} infoloading={infoloading}></FeedInfo>
                <Box>
                  <ModSettingIcon
                    info={info}
                    infoloading={infoloading}
                    User={User}
                  ></ModSettingIcon>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Collapse
                sx={{
                  backgroundColor: "background.dark",
                  borderRadius: 5,
                  padding: 1,
                  border: "1px solid",
                }}
                in={OpenSettings}
              >
                <Box display={"flex"}>
                  <FeedModSettings
                    info={info}
                    infoloading={infoloading}
                    User={User}
                    setFeedEditOpen={setFeedEditOpen}
                    item={info}
                  ></FeedModSettings>
                </Box>
              </Collapse>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <NewPostButton User={User}></NewPostButton>
            <FeedChat
              type={"feed"}
              User={User}
              info={info}
              infoloading={infoloading}
            ></FeedChat>
            <SubButton User={User}></SubButton>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "start" }}>
            <Box sx={{ alignContent: "center" }}>
              <FormControl>
                <Select
                  defaultValue={orderBy}
                  name="orderBy"
                  id="orderBy-select"
                  sx={{ color: "inherit" }}
                  size="small"
                  onChange={handleorderByChange}
                >
                  <Typography sx={{ paddingLeft: 2 }}>Sort by</Typography>
                  <MenuItem value={"POPULAR"}>Popular</MenuItem>
                  <MenuItem value={"NEWEST"}>Newest</MenuItem>
                  <MenuItem value={"HOTTEST"}>Hottest</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Divider></Divider>

          <Box>
            <InfiniteScroll
              dataLength={feed.length}
              next={loadmore}
              hasMore={hasmore}
              loader={<CircularProgress color="inherit"></CircularProgress>}
            >
              <Box>
                {feed.map((item) => (
                  <Box key={`feeditemfeedpage${item.id}`}>
                    <FeedItem
                      item={item}
                      setmessage={setmessage}
                      setseverity={setseverity}
                      owner={item.owner}
                      mods={info ? [...info.moderators, info.owner.id] : []}
                      User={User}
                    ></FeedItem>
                  </Box>
                ))}
              </Box>
            </InfiniteScroll>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 2, sm: 1 }}></Grid>
      </Grid>
    </Box>
  );
};
export default FeedPage;
