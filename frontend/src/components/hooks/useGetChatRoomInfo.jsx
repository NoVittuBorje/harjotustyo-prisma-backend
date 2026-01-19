import { useQuery } from "@apollo/client";
import { GET_CHAT_ROOM_INFO } from "../graphql/queries";

const useGetChatRoomInfo = ({roomId}) => {
  const { data, error, loading } = useQuery(GET_CHAT_ROOM_INFO, {
    variables: { roomId: roomId },
  });
  return { data: data, loading: loading, error: error };
}
export default useGetChatRoomInfo