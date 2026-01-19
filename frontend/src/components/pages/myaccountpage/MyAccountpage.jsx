import {
  Autocomplete,
  Box,
  Button,
  createFilterOptions,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditFieldItem from "./EditFieldItem";
import FileUpload from "../../utils/FileUpload";
import { useEffect, useState } from "react";
import UserAvatar from "../../utils/UserAvatar";
import useEditUser from "../../hooks/useEditUser";
import { GetCountries } from "../../utils/Getcountrys";
import TextEditor from "../../utils/TextEditor";
import parse from "html-react-parser";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router";

const MyAccountpage = ({ User }) => {
  const [imagePath, setImagePath] = useState(null);
  const [relationship, setRelationship] = useState(User.relationship);
  const [open, setOpen] = useState(false);
  const [avataredit, setavataredit] = useState(false);
  const [edit] = useEditUser();
  const navigate = useNavigate();
  const handleRelationshipchange = (event) => {
    setRelationship(event.target.value);
  };
  const [openNationality, setNationalityOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const hook = () => {
    GetCountries().then((res) => {
      setCountries(res.data);
    });
  };
  useEffect(hook, []);

  const handleSave = async ({ content, type }) => {
    await edit({ content: content, type: type });
  };

  const EditAvatar = () => {
    if (avataredit) {
      return (
        <Box>
          <FileUpload userid={User.id} setImagePath={setImagePath}></FileUpload>
          <Typography>{imagePath ? imagePath[1] : ""}</Typography>
          <Button
            className={"button"}
            style={{ borderRadius: 50 }}
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() =>
              handleSave({ content: imagePath[0], type: "Avatar" })
            }
          >
            {" "}
            save
          </Button>
          <Button
            className={"button"}
            style={{ borderRadius: 50 }}
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => setavataredit(!avataredit)}
          >
            cancel
          </Button>
        </Box>
      );
    } else {
      return (
        <Stack>
          <Box
            sx={{
              justifyContent: "center",
              borderTop: 1,
              display: "flex",
            }}
          >
            <Box sx={{ flexDirection: "column", paddingBottom: 1 }}>
              <Box>
                <Typography paddingRight={1}>Avatar:</Typography>
              </Box>
              <Box>
                <UserAvatar width={100} height={100} user={User}></UserAvatar>
              </Box>
            </Box>
          </Box>
          <Box>
            <Button
              className={"button"}
              style={{ borderRadius: 50 }}
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => setavataredit(!avataredit)}
            >
              edit
            </Button>
          </Box>
        </Stack>
      );
    }
  };
  const EditSelector = () => {
    if (open) {
      return (
        <Stack>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel color="inherit">Relationship: </InputLabel>
            <Select
              onChange={handleRelationshipchange}
              defaultValue={User.relationship}
              value={User.relationship}
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Dating">Dating</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <Box>
            <Button
              className={"button"}
              style={{ borderRadius: 50 }}
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => {
                handleSave({ content: relationship, type: "Relationship" });
                setOpen(!open);
              }}
            >
              save
            </Button>

            <Button
              className={"button"}
              style={{ borderRadius: 50 }}
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => setOpen(!open)}
            >
              cancel
            </Button>
          </Box>
        </Stack>
      );
    } else {
      return (
        <Box>
          <Tooltip followCursor={true} title={User.relationship}>
            <Typography>{`Relationship: ${User.relationship}`}</Typography>
          </Tooltip>
          <Button
            className={"button"}
            style={{ borderRadius: 50 }}
            size="small"
            variant="outlined"
            color=""
            onClick={() => setOpen(!open)}
          >
            edit
          </Button>
        </Box>
      );
    }
  };
  const EditNationality = () => {
    const usernationality = countries.find(
      (value) => value.name.common == User.nationality
    );
    const [selected, setSelected] = useState(usernationality);
    const filterOptions = createFilterOptions({
      limit: 10,
    });
    if (openNationality) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Autocomplete
            disablePortal
            filterOptions={filterOptions}
            value={selected}
            options={countries}
            getOptionLabel={(option) => `${option.name.common}`}
            getOptionKey={(option) => option.name.common}
            renderOption={(params, option) => (
              <Typography {...params}>
                {option.name.common}
                <img
                  style={{ objectFit: "contain" }}
                  width={30}
                  src={option.flags.svg}
                ></img>
              </Typography>
            )}
            renderInput={(params) => (
              <TextField
                sx={{
                  input: { color: "inherit" },
                  label: { color: "inherit" },
                }}
                {...params}
                label="Countries"
              />
            )}
            onChange={(event, newValue) => {
              setSelected(newValue);
            }}
          />
          <Box>
            <Button
              className={"button"}
              style={{ borderRadius: 50 }}
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => {
                handleSave({
                  content: selected.name.common,
                  type: "Nationality",
                });
                setNationalityOpen(!openNationality);
              }}
            >
              save
            </Button>
            <Button
              className={"button"}
              style={{ borderRadius: 50 }}
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => setNationalityOpen(!openNationality)}
            >
              cancel
            </Button>
          </Box>
        </Box>
      );
    } else {
      return (
        <Box>
          <Tooltip followCursor={true} title={User.nationality}>
            <Typography>{`Nationality: ${User.nationality}`}</Typography>
          </Tooltip>
          <Button
            className={"button"}
            style={{ borderRadius: 50 }}
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => setNationalityOpen(!openNationality)}
          >
            edit
          </Button>
        </Box>
      );
    }
  };
  const EditDescription = () => {
    const [open, setOpen] = useState(false);
    const validationSchema = yup.object().shape({
      description: yup.string().min(10).required(),
    });
    const description = User.description ? User.description : "";
    const formik = useFormik({
      initialValues: {
        description: description,
      },
      onSubmit: (values) => {
        handleSave({ content: values.description, type: "Description" });
      },
      validationSchema,
    });
    if (open) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "block" }}>
            <TextEditor
              html={formik.values.description}
              setHtml={formik.handleChange("description")}
            ></TextEditor>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Button
              className="button"
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: 50 }}
              onClick={formik.handleSubmit}
            >
              Save
            </Button>

            <Button
              className={"button"}
              style={{ borderRadius: 50 }}
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => setOpen(!open)}
            >
              cancel
            </Button>
          </Box>
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography paddingRight={1}>Description:</Typography>
          <Box sx={{ display: "block" }}>{parse(description)}</Box>
          <Button
            className={"button"}
            style={{ borderRadius: 50 }}
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => setOpen(!open)}
          >
            edit
          </Button>
        </Box>
      );
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowSpacing={1} sx={{ flexDirection: "row" }}>
        <Grid size={{ xs: 12, md: 2 }}></Grid>
        <Grid
          size={{ xs: 12, md: 8 }}
          container
          rowSpacing={1}
          sx={{ flexDirection: "row" }}
        >
          <Box
            className={"center"}
            sx={{ textAlign: "center", border: 1, borderRadius: 5 }}
          >
            <h3>My account</h3>
            <Stack spacing={1}>
              <Box sx={{ borderTop: 1 }} padding={1}>
                <Typography>Id: {User.id}</Typography>
              </Box>

              <EditAvatar></EditAvatar>
              <Box sx={{ borderTop: 1 }} padding={1}>
                <EditNationality></EditNationality>
              </Box>
              <EditFieldItem
                value={User.username}
                valueType={"Username"}
                handleSave={handleSave}
              ></EditFieldItem>
              <EditFieldItem
                value={User.email}
                valueType={"Email"}
                handleSave={handleSave}
              ></EditFieldItem>
              <Box sx={{ borderTop: 1 }} padding={1}>
                <EditDescription></EditDescription>
              </Box>

              <EditFieldItem
                value={User.firstname}
                valueType={"Firstname"}
                handleSave={handleSave}
              ></EditFieldItem>
              <EditFieldItem
                value={User.lastname}
                valueType={"Lastname"}
                handleSave={handleSave}
              ></EditFieldItem>
              <Box sx={{ borderTop: 1, padding: 1 }}>
                <EditSelector></EditSelector>
              </Box>
              <EditFieldItem
                value={User.work}
                valueType={"Work"}
                handleSave={handleSave}
              ></EditFieldItem>
              <Box sx={{ borderTop: 1, padding: 1 }}>
                <Button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete account")) {
                      if (
                        confirm("Are you sure sure you want to delete account")
                      ) {
                        edit({ type: "Deleteuser", content: "delete" });
                        localStorage.setItem("HomeorderBy", "POPULAR");
                        localStorage.setItem("FeedorderBy", "POPULAR");
                        sessionStorage.clear();
                        navigate("/");}
                      
                    }
                  }}
                >
                  Delete account
                </Button>
              </Box>
            </Stack>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}></Grid>
      </Grid>
    </Box>
  );
};
export default MyAccountpage;
