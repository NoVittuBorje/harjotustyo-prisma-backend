import { Avatar, Box, ListItemAvatar } from "@mui/material";
import useGetImageUrl from "../hooks/useGetImageUrl"
function stringToColor(string) {
  let hash = 0;
  let i;

   
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
   

  return color;
}

function stringAvatar({name,width,height}) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width:width,
      height:height,
      fontSize:height/2,
      
    },
    children: `${name.split(" ")[0][0]}`,
    
  };
}
const GetImage = ({img}) => {
    const {data,loading} = useGetImageUrl({imageId:img})
    if(!loading){
    return data
    }
}
const UserAvatar = ({user,height,width}) => {
    if(!user.avatar){
        return(
        <Avatar
        variant="circular"
          {...stringAvatar({name:user.username,height,width})}
        ></Avatar>

        )
    }else{
    const data = GetImage({img:user.avatar})
    if(data){
    return(
      <Avatar sx={{height:height,width:width}} src={data.getImage}>
        </Avatar>
    )}
}
}
export default UserAvatar