import { useMutation } from "@apollo/client";
import { DISLIKECOMMENT } from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";

const useDislikeComment = () => {
  const [mutate, result] = useMutation(DISLIKECOMMENT);
  const edit = async ({ id }) => {
    const data = await mutate({
      variables: {
        dislikeCommentId: id,
      },
      refetchQueries: [GET_ME],
    });
    return data;
  };
  return [edit, result];
};
export default useDislikeComment;
