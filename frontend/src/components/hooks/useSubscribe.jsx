import { useMutation } from "@apollo/client";
import { SUBSCRIBE } from "../graphql/mutations";
const useSubscribe = () => {
  const [mutate, result] = useMutation(SUBSCRIBE);
  const sub = async ({ feedname, type }) => {
    const data = await mutate({
      variables: { feedname: feedname, type: type },
      fetchPolicy: "no-cache"
    });
    return data;
  };
  return [sub, result];
};

export default useSubscribe;
