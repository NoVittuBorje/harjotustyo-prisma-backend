import { Box, Stack,Typography } from "@mui/material";
import useGetUserOwnedFeeds from "../../hooks/useGetUserOwnedFeeds";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router";
import Timestamp from "../../utils/Timestamp";
import parse from "html-react-parser";
const ProfileFeedOwnedFeeds = (variables) => {
  const navigate = useNavigate();
  const ownedfeeds = useGetUserOwnedFeeds(variables);
  const loadmore = () => {
    ownedfeeds.fetchMore({ offset: ownedfeeds.data.getuserownedfeeds.length });
  };
  if (ownedfeeds.loading) {
    return <Box>loading</Box>;
  }
  return (
    <Box>
      <InfiniteScroll
        dataLength={ownedfeeds.data.getuserownedfeeds.length}
        next={loadmore}
        hasMore={true}
      >
        {ownedfeeds.data.getuserownedfeeds.map((item, index) => (
          <Box key={index} sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ flexDirection: "column", padding: 1 }}>
              <Box
                className={"feed"}
                sx={{
                  padding: 1,
                  boxShadow: 3,
                  backgroundColor: "background.dark",
                  "&:hover": {
                    backgroundColor: "background.hover",
                  },
                }}
                key={item.id}
                onClick={() => {
                  navigate(`/feed/${item.feedname}`);
                }}
              >
                <Typography variant="h5">{item.feedname}</Typography>
                {parse(item.description)}
                <Typography>
                  Created :<Timestamp time={item.createdAt}></Timestamp>
                </Typography>
              </Box>

              <Stack></Stack>
            </Box>
          </Box>
        ))}
      </InfiniteScroll>
    </Box>
  );
};
export default ProfileFeedOwnedFeeds;
