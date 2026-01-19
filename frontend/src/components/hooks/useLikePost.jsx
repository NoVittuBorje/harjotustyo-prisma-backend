import { useMutation } from "@apollo/client";

import { LIKEPOST } from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";

const useLikePost = () => {
  const [mutate, result] = useMutation(LIKEPOST);
  const edit = async ({id}) => {
    const data = await mutate({
        variables:{
            likePostId:id
        },
        refetchQueries: [GET_ME],
    });
    return data;
  };
  return [edit, result];
};
export default useLikePost;