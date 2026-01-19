import { Box} from "@mui/material";
import FeedItem from "../../utils/FeedItem";
import useGetUserPosts from "../../hooks/useGetUserPosts";
import InfiniteScroll from "react-infinite-scroll-component";

const ProfileFeedPosts = ({
  variables,
  userdata,
  User,
  setmessage,
  setseverity,
}) => {

  
  let posts = useGetUserPosts(variables);
  const loadmore = () => {
    posts.fetchMore({ offset: posts.data.getuserposts.length });
  };
  if (posts.loading) {
    return <Box>loading</Box>;
  }

  return (
    <Box>
      <InfiniteScroll
        dataLength={posts.data.getuserposts.length}
        next={loadmore}
        hasMore={true}
      >
        {posts.data.getuserposts.map((item) => (
          <FeedItem
            setmessage={setmessage}
            setseverity={setseverity}
            item={item}
            owner={userdata}
            User={User}
          ></FeedItem>
        ))}
      </InfiniteScroll>
    </Box>
  );
};
export default ProfileFeedPosts;
