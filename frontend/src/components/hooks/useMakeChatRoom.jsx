import { MAKENEWCHATROOM } from "../graphql/mutations";
import { useMutation } from "@apollo/client";


const useMakeNewChatRoom = () => {
  const [mutate, result] = useMutation(MAKENEWCHATROOM);
  const newroom = async ({ name, type, feedId }) => {

    const data = await mutate({
        variables: { name: name, type: type, feedId: feedId },
    });
      return data;
    }
  return [newroom, result];
};
export default useMakeNewChatRoom;
