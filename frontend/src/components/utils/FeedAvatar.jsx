import { Avatar, } from "@mui/material";
import useGetImageUrl from "../hooks/useGetImageUrl"
import stringToColor from "./StringtoColor";


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
const FeedAvatar = ({feed,height,width}) => {
    if(!feed.feedavatar){
        return(
        <Avatar
        variant="circular"
          {...stringAvatar({name:feed.feedname,height,width})}
        ></Avatar>

        )
    }else{
    const data = GetImage({img:feed.feedavatar})
    if(data){
    return(
      <Avatar sx={{height:height,width:width}} src={data.getImage}>
        </Avatar>
    )}
}
}
export default FeedAvatar