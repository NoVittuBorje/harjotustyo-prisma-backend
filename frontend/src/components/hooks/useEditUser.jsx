import { useMutation } from "@apollo/client";
import { USEREDIT } from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";

const useEditUser = () => {
  const [mutate, result] = useMutation(USEREDIT);
  const edit = async ({ content, type }) => {
    const data = await mutate({
      variables: {
        content: content,
        type: type,
      },
      refetchQueries: [GET_ME],
    });
    return data;
  };
  return [edit, result];
};
export default useEditUser;
