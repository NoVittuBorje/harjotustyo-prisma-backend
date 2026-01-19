import { useMutation } from "@apollo/client";
import { EDITPOST } from "../graphql/mutations";

const useEditPost = () => {
  const [mutate, result] = useMutation(EDITPOST);
  const edit = async ({ postid, content, action }) => {
    const data = await mutate({
      variables: {
        postid: postid,
        content: content,
        action: action,
      },
    });
    return data;
  };
  return [edit, result];
};
export default useEditPost;
