import { useQuery } from "@apollo/client";
import { GET_FEED_SUBS_COUNT } from "../graphql/queries";

const useGetFeedSubsCount = (feedname) => {
  const { data, error, loading } = useQuery(GET_FEED_SUBS_COUNT, {
    variables: { feedname: feedname },
  });
  return { data: data, loading: loading, error: error };
};
export default useGetFeedSubsCount;
