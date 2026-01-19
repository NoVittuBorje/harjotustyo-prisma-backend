import { useQuery } from "@apollo/client";
import { GET_SEARCH_BAR } from "../graphql/queries";
const useGetSearch = ({ search }) => {
  const { data, error, loading, refetch, fetchMore, ...result } = useQuery(
    GET_SEARCH_BAR,
    { variables: { searchby: search } },
    {
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );
  const handleFetchMore = () => {
    fetchMore({ variables: { searchby: search } });
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
export default useGetSearch;
