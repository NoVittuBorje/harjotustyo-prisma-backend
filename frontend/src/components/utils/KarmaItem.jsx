import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import useLikeComment from "../hooks/useLikeComment";
import useDislikeComment from "../hooks/useDislikeComment";
import useLikePost from "../hooks/useLikePost";
import useDislikePost from "../hooks/useDislikePost";
import formatNumber from "./FormatNumber";
import numbertoColor from "./NumbertoColor";

const KarmaItem = ({ type, id, karma, User, setmessage, setseverity }) => {
  const navigate = useNavigate();
  const [likecomment] = useLikeComment();
  const [dislikecomment] = useDislikeComment();
  const [likepost] = useLikePost();
  const [dislikepost] = useDislikePost();

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  useEffect(() => {
    if (!User) {
      return;
    }

    if (type == "post") {
      var likesid = User.likedposts.map((i) => i.id);
      var dislikesid = User.dislikedposts.map((i) => i.id);
      if (likesid.includes(id)) {
        setLiked(true);
        setDisliked(false);
      } else {
        setLiked(false);
      }
      if (dislikesid.includes(id)) {
        setLiked(false);
        setDisliked(true);
      } else {
        setDisliked(false);
      }
    }
    if (type == "comment") {
      var likesid2 = User.likedcomments.map((i) => i.id);
      var dislikesid2 = User.dislikedcomments.map((i) => i.id);
      if (likesid2.includes(id)) {
        setLiked(true);
        setDisliked(false);
      } else {
        setLiked(false);
      }
      if (dislikesid2.includes(id)) {
        setLiked(false);
        setDisliked(true);
      } else {
        setDisliked(false);
      }
    }
  }, [User, type, id]);

  const handleDislikeComment = async ({ id }) => {
    try {
      await dislikecomment({ id: id });
    } catch (error) {
      setmessage(error.message);
      setseverity("error");
    }
  };
  const handleLikeComment = async ({ id }) => {
    try {
      await likecomment({ id: id });
    } catch (error) {
      setmessage(error.message);
      setseverity("error");
    }
  };
  const handleLikePost = async () => {
    try {
      await likepost({ id: id });
    } catch (error) {
      setmessage(error.message);
      setseverity("error");
    }
  };
  const handleDislikePost = async () => {
    try {
      await dislikepost({ id: id });
    } catch (error) {
      setmessage(error.message);
      setseverity("error");
    }
  };
  if (!User) {
    return (
      <Box
        sx={{ backgroundColor: "background.button" }}
        className={"footerkarma"}
      >
        <Tooltip title="Login to like">
          <IconButton
            className={"button"}
            onClick={() => navigate("/login")}
            size="small"
          >
            <ArrowUpwardRoundedIcon
              style={{ color: "grey" }}
            ></ArrowUpwardRoundedIcon>
          </IconButton>
        </Tooltip>
        <Tooltip title={`${karma} karma`}>
          <Typography
            style={{
              paddingTop: 0,
              textAlignVertical: "top",
              color: numbertoColor(karma),
            }}
          >
            {formatNumber(karma)}
          </Typography>
        </Tooltip>
        <Tooltip title="Login to dislike">
          <IconButton
            className={"button"}
            onClick={() => navigate("/login")}
            size="small"
          >
            <ArrowDownwardRoundedIcon
              style={{ color: "grey" }}
            ></ArrowDownwardRoundedIcon>
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  const LikeButton = ({
    handleLikePost,
    handleLikeComment,
    id,
    likeActive,
  }) => {
    if (likeActive) {
      return (
        <IconButton
          onClick={() => {
            if (type == "post") {
              handleLikePost({ id });
            } else {
              handleLikeComment({ id });
            }
          }}
          size="small"
        >
          <Tooltip title={"like"}>
            <ArrowUpwardRoundedIcon
              style={{ color: "lightgreen" }}
            ></ArrowUpwardRoundedIcon>
          </Tooltip>
        </IconButton>
      );
    }
    return (
      <IconButton
        onClick={() => {
          if (type == "post") {
            handleLikePost({ id });
          } else {
            handleLikeComment({ id });
          }
        }}
        size="small"
      >
        <Tooltip title={"like"}>
          <ArrowUpwardRoundedIcon
            style={{ color: "grey" }}
          ></ArrowUpwardRoundedIcon>
        </Tooltip>
      </IconButton>
    );
  };
  const DislikeButton = ({
    handleDislikePost,
    handleDislikeComment,
    id,
    dislikeActive,
  }) => {
    if (dislikeActive) {
      return (
        <IconButton
          className={"button"}
          onClick={() => {
            if (type == "post") {
              handleDislikePost({ id });
            } else {
              handleDislikeComment({ id });
            }
          }}
          size="small"
        >
          <Tooltip title={"dislike"}>
            <ArrowDownwardRoundedIcon
              style={{ color: "#fd4437ff" }}
            ></ArrowDownwardRoundedIcon>
          </Tooltip>
        </IconButton>
      );
    }
    return (
      <IconButton
        className={"button"}
        onClick={() => {
          if (type == "post") {
            handleDislikePost({ id });
          } else {
            handleDislikeComment({ id });
          }
        }}
        size="small"
      >
        <Tooltip title={"dislike"}>
          <ArrowDownwardRoundedIcon
            style={{ color: "grey" }}
          ></ArrowDownwardRoundedIcon>
        </Tooltip>
      </IconButton>
    );
  };
  return (
    <Box
      sx={{ backgroundColor: "background.button" }}
      className={"footerkarma"}
    >
      <Tooltip title="Like">
        <LikeButton
          id={id}
          handleLikePost={handleLikePost}
          handleLikeComment={handleLikeComment}
          type={type}
          dislikeActive={disliked}
          likeActive={liked}
          setLiked={setLiked}
          setDisliked={setDisliked}
        ></LikeButton>
      </Tooltip>
      <Tooltip title={`${karma} karma`}>
        <Typography
          style={{
            paddingTop: 0,
            textAlignVertical: "top",
            color: numbertoColor(karma),
          }}
        >
          {formatNumber(karma)}
        </Typography>
      </Tooltip>
      <Tooltip title="Dislike">
        <DislikeButton
          id={id}
          handleDislikePost={handleDislikePost}
          handleDislikeComment={handleDislikeComment}
          type={type}
          dislikeActive={disliked}
          likeActive={liked}
          setLiked={setLiked}
          setDisliked={setDisliked}
        ></DislikeButton>
      </Tooltip>
    </Box>
  );
};
export default KarmaItem;
