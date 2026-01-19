import { useMutation } from "@apollo/client";
import { CHATROOMINVITEACTIONS } from "../graphql/mutations";

const useChatRoomInviteAction = () => {
  const [mutate, result] = useMutation(CHATROOMINVITEACTIONS);
  const chatinviteaction = async ({ roomId, type }) => {
    const data = await mutate({
      variables: {
        roomId: roomId,
        type: type,
      }
    });
    return data;
  };
  return [chatinviteaction, result];
};
export default useChatRoomInviteAction;