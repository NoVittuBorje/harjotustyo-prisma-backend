import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import NewComment from "./NewComment";
import {
  Box,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import MoreComments from "./MoreComments";
import EditComment from "./EditComment";
import { useEffect, useState } from "react";
import useMakeComment from "../hooks/useMakeComment";
import useEditComment from "../hooks/useEditComment";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KarmaItem from "../utils/KarmaItem";
import Useritem from "../utils/Useritem";
const Comment = ({
  comment,
  handleDelete,
  User,
  handleModify,
  handleNewComment,
  postid,
  setmessage,
  setseverity,
}) => {
  const [replyopen, setReplyOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const [deleteopen, setDeleteOpen] = useState(false);
  const [ShowComments, setShowComments] = useState(false);
  const [newcomment] = useMakeComment();
  const [edit] = useEditComment();
  useEffect(() => {
    if ((sessionStorage.getItem(comment.id) === "true") & !ShowComments) {
      setShowComments(true);
    }
  }, [comment, ShowComments]);
  const handleReplyClick = () => {
    setReplyOpen(!replyopen);
  };

  const handleReply = async ({ content, commentid }) => {
    await newcomment({
      postid,
      content: content,
      replyto: commentid,
    });
    setReplyOpen(!replyopen);
  };
  const handleDel = async ({ commentid, content, action }) => {
    await edit({ commentid, content, action });
  };
  const handleMod = async ({ commentid, content, action }) => {
    await edit({ commentid, content, action });
  };

  const handleEditClick = () => {
    setEditOpen(!editopen);
  };
  const handleMoreComments = () => {
    setShowComments(true);
    sessionStorage.setItem(comment.id, true);
  };
  const handleDeleteOpen = () => {
    setDeleteOpen(!deleteopen);
  };
  const Showmorecomments = () => {
    if (comment.replies.length == 0) {
      return;
    }

    if (!ShowComments) {
      return (
        <Grid
          sx={{ display: "flex", flexDirection: "row", justifyItems: "center" }}
          container
        >
          <Grid>
            <IconButton
              size="small"
              onClick={() => {
                handleMoreComments();
              }}
            >
              <AddCircleOutlineIcon></AddCircleOutlineIcon>
            </IconButton>
          </Grid>
          <Grid alignItems="center" sx={{ display: "flex" }}>
            <Box>
              <Button
                size="small"
                variant="outlined"
                className="button"
                sx={{ borderRadius: 50 }}
                color="inherit"
                onClick={() => {
                  handleMoreComments();
                }}
              >
                show {comment.replies.length} replies
              </Button>
            </Box>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <MoreComments
          handleModify={handleMod}
          handleDelete={handleDel}
          handleReply={handleReply}
          comment={comment}
          ShowComments={ShowComments}
          User={User}
          postid={postid}
          setmessage={setmessage}
          setseverity={setseverity}
        ></MoreComments>
      );
    }
  };

  const Commentitem = ({ comment, index }) => {
    const [showComment, setShowComment] = useState(true);
    if (!showComment) {
      sessionStorage.setItem(comment.id, showComment);
      return (
        <Box
          sx={{
            paddingBottom: 0.5,
            color: "inherit",
            border: "1px black solid",
            borderRadius: 2,
            padding: 0.5,
            minWidth: "98%",
          }}
        >
          <Grid flexDirection={"row"} container>
            <Grid>
              <IconButton
                size="small"
                onClick={() => {
                  setShowComment(true);
                  sessionStorage.setItem(comment.id, true);
                }}
              >
                <AddCircleOutlineIcon></AddCircleOutlineIcon>
              </IconButton>
            </Grid>
            <Grid>
              <Useritem
                time={comment.createdAt}
                edittime={comment.updatedAt}
                user={comment.owner}
              ></Useritem>
            </Grid>
          </Grid>
        </Box>
      );
    }
    return (
      <Collapse sx={{ minWidth: "100%" }} in={showComment}>
        <Box key={index} sx={{ paddingBottom: 0.5 }}>
          <Box
            key={comment.id}
            sx={{
              color: "inherit",
              border: "1px black solid",
              borderRadius: 2,
              padding: 0.5,
              minWidth: "100%",
              maxWidth: "100%",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Box>
                <IconButton
                  size="small"
                  onClick={() => {
                    setShowComment(false);
                    sessionStorage.setItem(comment.id, false);
                  }}
                >
                  <RemoveCircleOutlineIcon></RemoveCircleOutlineIcon>
                </IconButton>
              </Box>
              <Box>
                <Useritem
                  time={comment.createdAt}
                  edittime={comment.updatedAt}
                  user={comment.owner}
                ></Useritem>

                <Box
                  sx={{
                    maxWidth: "100%",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <Typography style={{ wordWrap: "break-word" }}>
                    {comment.content}
                  </Typography>

                  <Box className={"footer"}>
                    <KarmaItem
                      User={User}
                      setmessage={setmessage}
                      setseverity={setseverity}
                      id={comment.id}
                      type={"comment"}
                      karma={comment.karma}
                    ></KarmaItem>
                    {ReplySection()}
                  </Box>
                </Box>
                <Collapse in={editopen} timeout={"auto"} unmountOnExit>
                  <EditComment
                    onReply={handleModify}
                    commentid={comment.id}
                    oldcomment={comment.content}
                    handleEditClick={handleEditClick}
                  ></EditComment>
                </Collapse>
                <Collapse in={replyopen} timeout={"auto"} unmountOnExit>
                  <NewComment
                    handleReply={handleReply}
                    handleNewComment={handleNewComment}
                    commentid={comment.id}
                    handleReplyClick={handleReplyClick}
                  ></NewComment>
                </Collapse>
              </Box>
            </Box>
            <Showmorecomments></Showmorecomments>
          </Box>
        </Box>
      </Collapse>
    );
  };
  const ReplySection = () => {
    if (!User) {
      return;
    }
    if (deleteopen) {
      return (
        <>
          <Dialog open={deleteopen} onClose={handleDeleteOpen}>
            <DialogTitle>
              {"Are you sure you want to delete comment?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>This action is irreversible</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                color="inherit"
                className="button"
                sx={{ borderRadius: 50 }}
                onClick={handleDeleteOpen}
              >
                No
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                className="button"
                sx={{ borderRadius: 50 }}
                onClick={() => {
                  handleDelete({
                    commentid: comment.id,
                    content: "",
                    action: "delete",
                  });
                  handleDeleteOpen();
                }}
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </>
      );
    } else {
      if (User.id == comment.owner.id) {
        return (
          <Box>
            <Button
              className={"button"}
              style={{ borderRadius: 50 }}
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => {
                handleReplyClick();
              }}
            >
              reply
            </Button>
            <Button
              className={"button"}
              style={{ borderRadius: 50 }}
              onClick={() => {
                handleEditClick();
              }}
              size="small"
              variant="outlined"
              color="inherit"
            >
              edit
            </Button>
            <Button
              className={"button"}
              style={{ borderRadius: 50 }}
              onClick={() => {
                handleDeleteOpen();
              }}
              size="small"
              variant="outlined"
              color="inherit"
            >
              delete
            </Button>
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
            onClick={() => {
              handleReplyClick();
            }}
          >
            reply
          </Button>
        );
      }
    }
  };
  if (comment.content || ShowComments) {
    return <Commentitem comment={comment}></Commentitem>;
  } else {
    return <></>;
  }
};

export default Comment;
