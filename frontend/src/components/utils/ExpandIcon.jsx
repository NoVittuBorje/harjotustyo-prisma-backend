import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const ExpandIcon = ({Open}) => {
      if(Open){
        return <ExpandLessIcon></ExpandLessIcon>
      }else{
        return <ExpandMoreIcon></ExpandMoreIcon>
      }
  }
export default ExpandIcon