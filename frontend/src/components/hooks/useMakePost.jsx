import { useMutation } from "@apollo/client";
import { MAKEPOST } from "../graphql/mutations";
import { GET_FEED_POSTS } from "../graphql/queries";

const useMakePost = () => {
  const [mutate, result] = useMutation(MAKEPOST,{
      refetchQueries: [
    GET_FEED_POSTS, // DocumentNode object parsed with gql
    "Getfeedposts", // Query name

  ],
  });
  const make = async ({ description, feedname, headline, img }) => {
    const data = await mutate({
      variables: {
        headline: headline,
        description: description,
        feedname: feedname,
        img: img,
      },
      refetchQueries: [GET_FEED_POSTS,"getfeedposts"],
    });
    return data;
  };
  return [make, result];
};
export default useMakePost;
