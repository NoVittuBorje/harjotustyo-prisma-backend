import { useMutation } from "@apollo/client";
import { SENDFRIENDREQUEST } from "../graphql/mutations";

const useSendFriendRequest = () => {
  const [mutate, result] = useMutation(SENDFRIENDREQUEST);
  const SendFriendRequest = async ({ userId }) => {
    const data = await mutate({
      variables: {
        userId: userId,
      }
    });
    return data;
  };
  return [SendFriendRequest, result];
};
export default useSendFriendRequest;