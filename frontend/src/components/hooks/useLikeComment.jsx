import { useMutation } from "@apollo/client";

import { LIKECOMMENT } from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";

const useLikeComment = () => {
  const [mutate, result] = useMutation(LIKECOMMENT);
  const edit = async ({ id }) => {
    const data = await mutate({
      variables: {
        likeCommentId: id,
      },
      refetchQueries: [GET_ME],
    });
    return data;
  };
  return [edit, result];
};
export default useLikeComment;
