import { useMutation } from "@apollo/client";
import { FRIENDSREQUESTACTIONS } from "../graphql/mutations";

const useFriendsRequestActions = () => {
  const [mutate, result] = useMutation(FRIENDSREQUESTACTIONS);
  const friendsaction = async ({ userId, type }) => {
    const data = await mutate({
      variables: {
        userId: userId,
        type: type,
      }
    });
    return data;
  };
  return [friendsaction, result];
};
export default useFriendsRequestActions;