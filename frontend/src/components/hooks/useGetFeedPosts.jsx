import { useQuery } from "@apollo/client";
import { GET_FEED_POSTS } from "../graphql/queries";
const useGetFeedPosts = (variables) => {
  const { data, error, loading, refetch, fetchMore, ...result } = useQuery(
    GET_FEED_POSTS,
    { variables: { ...variables, offset: 0 } },
    {
      fetchPolicy: "network-only",
      nextFetchPolicy: "network-only",
    }
  );
  const handleFetchMore = ({ offset }) => {
    fetchMore({
      variables: {
        ...variables,
        offset: offset,
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
export default useGetFeedPosts;
