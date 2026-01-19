import { useQuery } from "@apollo/client";
import { GET_USER_SUBS } from "../graphql/queries";
const useGetUserSubs = ({ variables }) => {
  const { data, error, loading, refetch, fetchMore, ...result } = useQuery(
    GET_USER_SUBS,
    { variables: { offset: 0, userid: variables.id } },
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
export default useGetUserSubs;
