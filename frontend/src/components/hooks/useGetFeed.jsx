import { useQuery } from "@apollo/client";
import { GET_FEED } from "../graphql/queries";
const useGetFeed = ({ feedname }) => {
  const { data, error, loading, refetch, fetchMore, ...result } = useQuery(
    GET_FEED,
    { variables: { feedname: feedname, querytype: "single" } },
    {
      fetchPolicy: "network-only",
      nextFetchPolicy: "network-only",
    }
  );
  const handleFetchMore = () => {
    fetchMore({
      variables: {
        feedname: feedname,
        querytype: "single",
      },
    });
  };
  return {
    data: data,
    loading: loading,
    error: error,
    refetch: refetch,
    fetchMore: handleFetchMore,
    ...result,
  };
};
export default useGetFeed;
