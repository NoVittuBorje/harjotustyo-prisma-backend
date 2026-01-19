import { MAKECOMMENT } from "../graphql/mutations";
import { useMutation } from "@apollo/client";
import { GET_COMMENTS } from "../graphql/queries";

const useMakeComment = () => {
  const [mutate, result] = useMutation(MAKECOMMENT);
  const comment = async ({ postid, replyto, content }) => {
    if (replyto) {
      const data = await mutate({
        variables: { postid: postid, replyto: replyto, content: content },
      });
      return data;
    } else {
      const data = await mutate({
        variables: { postid: postid, replyto: null, content: content },
      });
      return data;
    }
  };
  return [comment, result];
};
export default useMakeComment;
