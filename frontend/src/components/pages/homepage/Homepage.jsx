import {
  Box,
  Divider,
  Grid,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Typography,
} from "@mui/material";

import FeedItem from "../../utils/FeedItem";
import useGetPopularPosts from "../../hooks/useGetPopularPosts";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";

const Homescreen = ({ User,setmessage,setseverity }) => {
  if(!localStorage.getItem("HomeorderBy")){localStorage.setItem("HomeorderBy","POPULAR")}
  const [orderBy, setorderBy] = useState(localStorage.getItem("HomeorderBy"));
  useEffect(() => {
    setorderBy(localStorage.getItem("HomeorderBy"))
  },[])
    useEffect(() => {
    localStorage.setItem("HomeorderBy",orderBy)
  },[orderBy])

  const variables = {
    orderBy: orderBy,
  };
  const { data, fetchMore } = useGetPopularPosts(variables);
  const handleChange = (event) => {
    setorderBy(event.target.value);
  };
  const feed = data ? data.getpopularposts : [];


  const loadmore = () => {
    fetchMore({ offset: feed.length });
  };
  
  let hasmore = true;
  if (feed.length % 10 != 0 || hasmore === false || feed.length == 0) {

    hasmore = false
  }
  
  const UserSubs = () => {
    if(!User){return}

    if(User.feedsubs.length > 0){
      return(
        <MenuItem value={"SUBSCRIPTIONS"}>Subscriptions</MenuItem>
      )
    }
    return
  }
  const UserFeeds = () => {
    if(!User){return}
    if(User.ownedfeeds.length > 0){
      return(
        <MenuItem value={"OWNEDFEEDS"}>Owned feeds</MenuItem>
      )
    }
    return
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowSpacing={1} sx={{ flexDirection: "row" }}>
        <Grid size={{ xs: 12, md: 2 }}></Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          
          <FormControl sx={{padding:1}}
          >
            <Select
              defaultValue={orderBy}
              name="orderBy"
              id="orderBy-select"
              size="small"
              
              sx={{ color: "inherit"}}
              onChange={handleChange}
              value={orderBy}
            >
              <Typography sx={{paddingLeft:2}}>Sort by</Typography>
              <MenuItem value={"POPULAR"}>Popular</MenuItem>
              <MenuItem value={"NEWEST"}>Newest</MenuItem>
              <MenuItem value={"HOTTEST"}>Hottest</MenuItem>
              {UserSubs()}
              {UserFeeds()}
            </Select>
          </FormControl>

          <Divider></Divider>
          <InfiniteScroll
            dataLength={feed.length}
            next={loadmore}
            hasMore={hasmore}
            loader={<CircularProgress color="inherit"></CircularProgress>}
          >
            
            {feed.map((item) => (
              <Box key={`feeditemhomepage${item.id}`}>
              <FeedItem item={item} setseverity={setseverity} setmessage={setmessage} owner={item.owner} User={User}></FeedItem>
              </Box>
            ))}
            
          </InfiniteScroll>
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}></Grid>
      </Grid>
    </Box>
  );
};
export default Homescreen;
