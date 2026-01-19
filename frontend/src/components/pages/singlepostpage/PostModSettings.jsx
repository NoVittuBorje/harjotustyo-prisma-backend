import { Box, Button, Stack, Typography } from "@mui/material"
import useEditFeed from "../../hooks/useEditFeed";
const PostModSettings = ({item}) => {
    const [editfeed] = useEditFeed()
    const LockState = () => {
      if(item.locked){
        return(
          <Button className="button" sx={{borderRadius:50}} onClick={() => editfeed({feedid:item.feed.id,action:"unlockpost",content:item.id})} size="small" variant="outlined" color="inherit">UnLock post</Button>
        )
      }else{
        return(
          <Button className="button" sx={{borderRadius:50}} onClick={() => editfeed({feedid:item.feed.id,action:"lockpost",content:item.id})} size="small" variant="outlined" color="inherit">Lock post</Button>
        )
      }
    }

    return(
        <Box sx={{display:"flex",justifyContent:"center",justifyItems:"center"}}>
        <Stack direction={"column"} sx={{justifyContent:"center",justifyItems:"center"}}>
        <Typography>Mod settings:</Typography>
        <Button className="button" sx={{borderRadius:50}} onClick={() => editfeed({feedid:item.feed.id,action:"ban",content:item.owner.id})} size="small" variant="outlined" color="inherit">Ban poster</Button>
        <Button className="button" sx={{borderRadius:50}} onClick={() => editfeed({feedid:item.feed.id,action:"deletepost",content:item.id})} size="small" variant="outlined" color="inherit">Delete post</Button>
        <LockState></LockState>
        </Stack>
      </Box>
    )
}
export default PostModSettings