import { useQuery } from "@apollo/client";
import { GET_SEARCH_USERS } from "../graphql/queries";
const useGetSearchUsers = ({ search }) => {
  const { data, error, loading, refetch, fetchMore, ...result } = useQuery(
    GET_SEARCH_USERS,
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
export default useGetSearchUsers;
