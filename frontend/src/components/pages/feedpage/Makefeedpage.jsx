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
import useMakeFeed from "../../hooks/useMakeFeed";
import { useNavigate } from "react-router";
import TextEditor from "../../utils/TextEditor";

const validationSchema = yup.object().shape({
  feedname: yup.string().min(2).max(20).required(),
  description: yup.string().min(10).max(1000).required(),
});
const MakeFeedPage = () => {
  const [make] = useMakeFeed();

  const navigate = useNavigate();
  const handleFormSubmit = async () => {
    const data = await make({
      feedname: formik.values.feedname,
      description: formik.values.description,
    });

    if (data.data.makeFeed) {
      navigate(`/feed/${formik.values.feedname}`);
    }
  };

  const formik = useFormik({
    initialValues: {
      feedname: "",
      description: "",
    },
    onSubmit: (values) => {
      handleFormSubmit(values);
    },
    validationSchema,
  });
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ textAlign: "center" }}>
        <h3>Make new feed</h3>
      </Box>
      <Grid container rowSpacing={1} sx={{ flexDirection: "row" }}>
        <Grid size={{ xs: 12, md: 2 }}></Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ border: "solid 0.1em", borderRadius: 1 }}>
            <FormGroup
              sx={{
                alignItems: "center",
                verticalAlign: "center",
                marginTop: 1,
              }}
            >
              <TextField
                required
                sx={{ m: 0.5, width: "30%" }}
                value={formik.values.feedname}
                error={formik.errors.feedname}
                label="Feed name"
                variant="outlined"
                inputProps={{ style: { color: "inherit" } }}
                InputLabelProps={{ style: { color: "inherit" } }}
                helperText={
                  formik.errors.feedname ? formik.errors.feedname : ""
                }
                onChange={formik.handleChange("feedname")}
              />
              <Typography>Description: </Typography>
              <Box sx={{}} className="error">
                {formik.errors.description ? formik.errors.description : ""}
              </Box>
              <TextEditor
                html={formik.values.description}
                setHtml={formik.handleChange("description")}
              ></TextEditor>
              <Button
                className="button"
                variant="outlined"
                color="inherit"
                sx={{ borderRadius: 50 }}
                onClick={formik.handleSubmit}
              >
                Make feed
              </Button>
            </FormGroup>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}></Grid>
      </Grid>
    </Box>
  );
};
export default MakeFeedPage;
