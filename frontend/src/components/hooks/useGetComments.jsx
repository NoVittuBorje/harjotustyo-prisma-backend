import { useQuery } from "@apollo/client";
import { GET_COMMENTS } from "../graphql/queries";
const useGetComments = ({ commentid }) => {
  const { data, error, loading, refetch } = useQuery(
    GET_COMMENTS,
    { variables: { commentid: commentid, offset: 0 } },
    {
      fetchPolicy: "network-only",
      nextFetchPolicy: "network-only",
    }
  );
  return {
    data: data,
    loading: loading,
    error: error,
    refetchComments: refetch,
  };
};
export default useGetComments;
