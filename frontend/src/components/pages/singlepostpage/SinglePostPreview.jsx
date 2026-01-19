import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import SinglePostImage from "./SinglePostImage";

import parse from "html-react-parser";
const SinglePostPreview = ({ postdata }) => {
  const ifimage = () => {
    if (postdata.img) {
      return <SinglePostImage img={postdata.img}></SinglePostImage>;
    } else {
      return;
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowSpacing={1} sx={{ flexDirection: "row" }}>
        <Grid size={{ xs: 12, md: 2 }}></Grid>
        <Grid size={{ xs: 12, md: 8 }} sx={{}}>
          <Box className={"postDesc"}>
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
                >{`in f/${postdata.feedname}`}</Typography>
              </Button>
            </Box>

            {ifimage()}
            {parse(postdata.description)}

            <Divider></Divider>
          </Box>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}></Grid>
    </Box>
  );
};
export default SinglePostPreview;
