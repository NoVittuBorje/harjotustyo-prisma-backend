import {
  Box,
  FormGroup,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import useMakePost from "../../hooks/useMakePost";
import { useNavigate } from "react-router";
import FileUpload from "../../utils/FileUpload";

import { useState } from "react";
import TextEditor from "../../utils/TextEditor";

import SinglePostPreview from "../singlepostpage/SinglePostPreview";

const validationSchema = yup.object().shape({
  headline: yup.string().min(4).max(100).required(),
  description: yup.string().min(10).max(5000).required(),
});
const NewPostpage = ({ match, User }) => {
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mutate] = useMakePost();
  const [imagepath, setImagePath] = useState("");
  const handleFormSubmit = async () => {
    const data = await mutate({ ...formik.values, img: imagepath[0] });
    if (data.data.makePost) {
      navigate(`/post/${data.data.makePost.id}`);
    }
  };
  const Uploadedimages = () => {
    if (imagepath.length != 0) {
      return <Typography>{imagepath[1]}</Typography>;
    }
  };
  const formik = useFormik({
    initialValues: {
      headline: "",
      description: "",
      feedname: match.params.postfeedname,
    },
    onSubmit: (values) => {
      handleFormSubmit(values, imagepath);
    },
    validationSchema,
  });
  if (previewOpen) {
    const postdata = {
      headline: formik.values.headline,
      description: formik.values.description,
      feedname: formik.values.feedname,
      img: imagepath[0],
    };
    return (
      <Box>
        <Button
          onClick={() => setPreviewOpen(!previewOpen)}
          sx={{ borderRadius: 50 }}
          className="button"
          variant="outlined"
          color="inherit"
        >
          close preview
        </Button>
        <SinglePostPreview postdata={postdata}></SinglePostPreview>
      </Box>
    );
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ textAlign: "center" }}>
        <h3>{"Make post to " + match.params.postfeedname}</h3>
      </Box>
      <Grid container rowSpacing={1} sx={{ flexDirection: "row" }}>
        <Grid size={{ xs: 12, md: 2 }}></Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ border: "solid 0.1em", borderRadius: 1 }}>
            <FormGroup
              sx={{
                alignItems: "center",
                verticalAlign: "center",
              }}
            >
              <TextField
                required
                sx={{ m: 0.5 }}
                value={formik.values.headline}
                error={formik.errors.headline}
                label="Headline"
                variant="outlined"
                helperText={
                  formik.errors.headline ? formik.errors.headline : ""
                }
                multiline
                inputProps={{ style: { color: "inherit" } }}
                onChange={formik.handleChange("headline")}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  borderBottom: 1,
                }}
              >
                <Typography>Image: </Typography>
                <FileUpload
                  setImagePath={setImagePath}
                  userid={User.id}
                ></FileUpload>
                {Uploadedimages()}
              </Box>
              <Typography>Description: </Typography>
              <Box sx={{}} className="error">
                {formik.errors.description ? formik.errors.description : ""}
              </Box>
              <TextEditor
                html={formik.values.description}
                setHtml={formik.handleChange("description")}
              ></TextEditor>
              <Button
                sx={{ borderRadius: 50 }}
                onClick={formik.handleSubmit}
                className="button"
                variant="outlined"
                color="inherit"
              >
                Make post
              </Button>
              <Button
                onClick={() => setPreviewOpen(!previewOpen)}
                sx={{ borderRadius: 50 }}
                className="button"
                variant="outlined"
                color="inherit"
              >
                preview
              </Button>
            </FormGroup>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}></Grid>
      </Grid>
    </Box>
  );
};
export default NewPostpage;
