import { Box } from "@mui/material"
import useGetImageUrl from "../../hooks/useGetImageUrl"

const SinglePostImage = ({img}) => {
    const {data,loading} = useGetImageUrl({imageId:img})
    if(!loading){

    return(
        <img src={data.getImage} style={{maxHeight:500,maxWidth:"100%",borderRadius:15}}></img>
    )}
}
export default SinglePostImage