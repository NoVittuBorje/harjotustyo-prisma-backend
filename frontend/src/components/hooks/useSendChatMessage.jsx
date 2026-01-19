import { useMutation } from "@apollo/client";
import { SENDCHATMESSAGE } from "../graphql/mutations";


const useSendChatMessage = () => {
  const [mutate, result] = useMutation(SENDCHATMESSAGE);
  const sendchat = async ({ content, roomId }) => {
    const data = await mutate({
      variables: { content: content, roomId: roomId },
      fetchPolicy: "no-cache"
    });
    return data;
  };
  return [sendchat, result];
};
export default useSendChatMessage;