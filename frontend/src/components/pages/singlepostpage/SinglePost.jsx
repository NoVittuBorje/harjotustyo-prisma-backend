import {
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CommentSection from "../../commentsection/CommentSection";
import useGetPost from "../../hooks/useGetPost";
import useMakeComment from "../../hooks/useMakeComment";
import CommentForm from "./CommentForm";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { useState } from "react";
import Useritem from "../../utils/Useritem";
import KarmaItem from "../../utils/KarmaItem";
import { useNavigate } from "react-router";
import useEditPost from "../../hooks/useEditPost";

import useGetPostComments from "../../hooks/useGetPostComments";
import SinglePostImage from "./SinglePostImage";
import SettingsIcon from "@mui/icons-material/Settings";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import parse from "html-react-parser";
import PostModSettings from "./PostModSettings";
import Locked from "../../utils/Locked";

const SinglePost = ({ match, User, refetchUser, setmessage, setseverity }) => {
  const id = match.params.id;
  const navigate = useNavigate();
  const [edit] = useEditPost();
  const { data, refetchPost } = useGetPost({ id });

  const postcomments = useGetPostComments({ postid: id });
  const [newcomment] = useMakeComment();
  const [openNewComment, setopenNewComment] = useState(false);
  const [OpenSettings, setOpenSettings] = useState(false);
  const [openModSettings, setOpenModSettings] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleNewComment = async (content) => {
    await newcomment({ postid: id, content: content.content });
    setopenNewComment(false);
    postcomments.refetchPostComment();
  };

  const handleDelete = async () => {
    await edit({ action: "delete", content: "", postid: id });

    refetchPost();
    navigate(-1);
  };
  const loadmore = () => {
    if (postcomments.data.getpostcomments.length % 10 == 0) {
      postcomments.fetchMore({
        offset: postcomments.data.getpostcomments.length,
      });
    }
  };

  const PostSettings = ({ info, User }) => {
    if (!User) {
      return;
    }
    const DeletePost = () => {
      return (
        <Stack>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Are you sure you want to delete post?"}</DialogTitle>
            <DialogContent>
              <DialogContentText>This action is irreversible</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                color="inherit"
                sx={{ borderRadius: 50 }}
                onClick={() => handleClose()}
              >
                No
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                sx={{ borderRadius: 50 }}
                onClick={() => {
                  handleDelete();
                  handleClose();
                }}
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            variant="outlined"
            color="inherit"
            className={"button"}
            sx={{ borderRadius: 50 }}
            onClick={() => handleClickOpen()}
          >
            Delete post
          </Button>
        </Stack>
      );
    };
    if (!OpenSettings & (info.owner.username == User.username)) {
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
      return (
        <Collapse in={OpenSettings}>
          <Box sx={{ display: "flex" }}>
            <IconButton
              className={"button"}
              sx={{ color: "inherit" }}
              onClick={() => setOpenSettings(!OpenSettings)}
            >
              <SettingsIcon></SettingsIcon>
            </IconButton>
            <DeletePost></DeletePost>
          </Box>
        </Collapse>
      );
    }
  };
  const NewCommentform = () => {
    if (User) {
      return (
        <Box>
          <Tooltip title="New comment">
            <IconButton
              className={"button"}
              onClick={() => {
                setopenNewComment(!openNewComment);
              }}
            >
              <AddCommentIcon style={{ color: "inherit" }}></AddCommentIcon>
            </IconButton>
          </Tooltip>
        </Box>
      );
    } else {
      return (
        <Box>
          <Tooltip title="Login to comment">
            <IconButton
              className={"button"}
              onClick={() => {
                navigate("/login");
              }}
            >
              <AddCommentIcon style={{ color: "inherit" }}></AddCommentIcon>
            </IconButton>
          </Tooltip>
        </Box>
      );
    }
  };
  const postdata = data ? data.getpost : [];
  const comments = postcomments.data ? postcomments.data.getpostcomments : [];

  if (postdata.feed) {
    const mods = [postdata.feed.owner.id, ...postdata.feed.moderators];

    const Postimage = () => {
      if (postdata.img) {
        return (
          <Box className="imagecontainer">
            <SinglePostImage img={postdata.img}></SinglePostImage>
          </Box>
        );
      } else {
        return;
      }
    };
    const ModSettings = () => {
      if (!mods || !User) {
        return;
      }
      if (mods.includes(User.id)) {
        return (
          <IconButton
            className={"button"}
            sx={{ color: "inherit" }}
            onClick={() => {
              setOpenModSettings(!openModSettings);
            }}
          >
            <SettingsIcon></SettingsIcon>
          </IconButton>
        );
      }
    };
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={1} sx={{ flexDirection: "row" }}>
          <Grid size={{ xs: 12, md: 2, sm: 0 }}></Grid>
          <Grid size={{ xs: 12, md: 8, sm: 10 }} sx={{}}>
            <Box className={"postDesc"}>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <IconButton
                  className={"button"}
                  sx={{ color: "inherit" }}
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  <ArrowBackIcon></ArrowBackIcon>
                </IconButton>
                <PostSettings User={User} info={postdata}></PostSettings>
              </Box>
              <Useritem
                time={postdata.createdAt}
                user={postdata.owner}
              ></Useritem>
              <Stack spacing={1}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                    marginBottom: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      textDecoration: "underline",
                      textDecorationThickness: 1,
                    }}
                  >
                    {postdata.headline}
                  </Typography>

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
                      onClick={() => {
                        navigate(`/feed/${postdata.feed.feedname}`);
                      }}
                    >{`in f/${postdata.feed.feedname}`}</Typography>
                  </Button>
                  <Locked locked={postdata.locked}></Locked>
                </Box>

                <Postimage></Postimage>
                <Box sx={{ padding: 1 }}>{parse(postdata.description)}</Box>
                <Box className={"footer"}>
                  <KarmaItem
                    id={postdata.id}
                    User={User}
                    type={"post"}
                    karma={postdata.karma}
                    setmessage={setmessage}
                    setseverity={setseverity}
                  ></KarmaItem>
                  <NewCommentform></NewCommentform>
                </Box>
                <Collapse in={openNewComment} timeout={"auto"} unmountOnExit>
                  <CommentForm
                    postid={postdata.id}
                    onSubmit={(comment) => handleNewComment(comment)}
                  />
                </Collapse>
              </Stack>
              <Divider></Divider>
              <CommentSection
                item={postdata.comments}
                User={User}
                refetchComment={postcomments.refetchPostComment}
                refetchUser={refetchUser}
                comments={comments}
                loadmore={loadmore}
                loading={postcomments.loading}
                postid={postdata.id}
                setmessage={setmessage}
                setseverity={setseverity}
              ></CommentSection>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 2, sm: 2 }}>
            <Box sx={{ margin: 1 }}>
              <ModSettings></ModSettings>
              <Collapse
                in={openModSettings}
                sx={{
                  backgroundColor: "background.dark",
                  borderRadius: 5,
                  padding: 1,
                  border: "1px solid",
                }}
              >
                <PostModSettings item={postdata}></PostModSettings>
              </Collapse>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  } else {
    <Box>loading</Box>;
  }
};

export default SinglePost;
