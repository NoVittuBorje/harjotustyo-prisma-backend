import { Alert,  Snackbar } from "@mui/material";

const Alerts = ({ msg, severity, setmessage, setOpen,open }) => {
  if (msg) {
    return (
      <Snackbar
        open={open}
        onClose={() => {
          setOpen(false);
          setmessage(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={6000}
      >
        <Alert
          sx={{ width: "100%" }}
          severity={severity}
          onClose={() => {
            setmessage(null);
            setOpen(false);
          }}
        >
          {msg}
        </Alert>
      </Snackbar>
    );
  } else {
    return;
  }
};
export default Alerts;
