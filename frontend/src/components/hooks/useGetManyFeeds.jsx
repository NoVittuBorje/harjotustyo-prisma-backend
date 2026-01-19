import { useQuery } from "@apollo/client";
import { GET_ALL_FEED } from "../graphql/queries";
const useGetManyFeeds = () => {
  const { data, error, loading, refetch } = useQuery(
    GET_ALL_FEED,
    { variables: { querytype: "many" } },
    {
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );
  return { data: data, loading: loading, error: error, refetch: refetch };
};
export default useGetManyFeeds;
