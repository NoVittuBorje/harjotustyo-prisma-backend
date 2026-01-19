import { useQuery } from "@apollo/client";
import { GET_POPULAR_POSTS } from "../graphql/queries";
const useGetPopularPosts = (variables) => {
  const { data, error, loading, refetch, fetchMore, ...result } = useQuery(
    GET_POPULAR_POSTS,
    { variables: { offset: 0, ...variables } },
    {
      fetchPolicy: "network-only",
      nextFetchPolicy: "network-only",
    }
  );
  const handleFetchMore = ({ offset }) => {
    fetchMore({
      variables: {
        offset: offset,
        ...variables,
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
export default useGetPopularPosts;
