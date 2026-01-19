import { useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/queries";
const useGetUser = ({ id }) => {
  const { data, error, loading, refetch } = useQuery(
    GET_USER,
    { variables: { getuserId: id } },
    {
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );
  return { data: data, loading: loading, error: error, refetch: refetch };
};
export default useGetUser;
