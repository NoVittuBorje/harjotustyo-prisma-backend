import InfiniteScroll from "react-infinite-scroll-component";
import useGetUserSubs from "../../hooks/useGetUserSubs";
import { Box, Link, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import parse from "html-react-parser";
const ProfileFeedSubs = (variables) => {
  const navigate = useNavigate();
  const subs = useGetUserSubs(variables);
  const loadmore = () => {
    subs.fetchMore({ offset: subs.data.getusersubs.length });
  };
  if (subs.loading) {
    return <Box>loading</Box>;
  }

  return (
    <Box>
      <InfiniteScroll
        dataLength={subs.data.getusersubs.length}
        next={loadmore}
        hasMore={true}
      >
        {subs.data.getusersubs.map((item) => (
          <Box sx={{ display: "flex", flexDirection: "column" }}>

              <Link
                variant="inherit"
                underline="none"
                color="inherit"
                onClick={() => {
                  navigate(`/feed/${item.feedname}`);
                }}
              >
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
                >
                  <Typography variant="h5">{item.feedname}</Typography>
                  {parse(item.description)}
                </Box>
              </Link>
              <Stack></Stack>
            </Box>
        ))}
      </InfiniteScroll>
    </Box>
  );
};
export default ProfileFeedSubs;
