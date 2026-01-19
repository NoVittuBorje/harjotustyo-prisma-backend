import { useMutation } from "@apollo/client";
import { MAKEFEED } from "../graphql/mutations";
import { GET_FEED } from "../graphql/queries";

const useMakeFeed = () => {
  const [mutate, result] = useMutation(MAKEFEED);
  const make = async ({ description, feedname }) => {
    const data = await mutate({
      variables: { description: description, feedname: feedname },
      refetchQueries: [GET_FEED, "useGetFeed"],
    });
    return data;
  };
  return [make, result];
};
export default useMakeFeed;
