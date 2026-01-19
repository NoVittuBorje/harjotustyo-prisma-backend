import { Tooltip } from "@mui/material"
import LockIcon from '@mui/icons-material/Lock';

const Locked = ({locked}) => {
    if(locked){
    return(
      <Tooltip title="This post is locked!"><LockIcon></LockIcon></Tooltip>
    )}else{
      return
    }
  }
export default Locked