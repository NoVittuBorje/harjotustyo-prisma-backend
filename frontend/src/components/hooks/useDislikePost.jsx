import { useMutation } from "@apollo/client";
import { DISLIKEPOST } from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";

const useDislikePost = () => {
  const [mutate, result] = useMutation(DISLIKEPOST);
  const edit = async ({ id }) => {
    const data = await mutate({
      variables: {
        dislikePostId: id,
      },
      refetchQueries: [GET_ME],
    });
    return data;
  };
  return [edit, result];
};
export default useDislikePost;
