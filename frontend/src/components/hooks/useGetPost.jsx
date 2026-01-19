import { useQuery } from "@apollo/client";
import { GET_POST } from "../graphql/queries";
const useGetPost = ({ id }) => {
  const { data, error, loading, refetch } = useQuery(
    GET_POST,
    { variables: { postid: id } },
    {
      fetchPolicy: "network-only",
      nextFetchPolicy: "network-only",
    }
  );
  return { data: data, loading: loading, error: error, refetchPost: refetch };
};
export default useGetPost;
