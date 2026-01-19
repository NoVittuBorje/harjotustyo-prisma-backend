import { Typography } from "@mui/material";

const Timestamp = ({time}) => {
  const createdtime = new Date(Number(time));
  const ms = Math.abs(new Date() - createdtime);
  const sec = Math.floor(ms / 1000);
    const timestring = () =>{
  if (sec < 60) {
    return ` ${sec} seconds ago`;
  }
  const min = Math.floor((sec / 60) << 0);
  if ((min > 0) & (min < 60)) {
    return ` ${min} minutes ago`;
  }
  const hr = Math.floor((min / 60) << 0);
  if ((hr <= 24) & (hr >= 1)) {
    return ` ${hr} hr ago`;
  }
  const days = Math.floor((hr / 24) << 0);
  if ((days > 0) & (days < 365)) {
    return ` ${days} days ago`;
  }
  const years = Math.floor((days / 365) << 0);
  if (years > 0) {
    return ` ${years} years ago`;
  }}
  return(
    <Typography variant="h9" sx={{ color: "grey" }}>
        {timestring()}
    </Typography>
  )
};
export default Timestamp