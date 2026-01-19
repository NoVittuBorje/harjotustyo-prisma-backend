import { useMutation } from "@apollo/client";
import { EDITFEED } from "../graphql/mutations";

const useEditFeed = () => {
  const [mutate, result] = useMutation(EDITFEED);
  const edit = async ({ feedid, content, action }) => {
    const data = await mutate({
      variables: {
        feedid: feedid,
        content: content,
        action: action,
      },
    });
    return data;
  };
  return [edit, result];
};
export default useEditFeed;
