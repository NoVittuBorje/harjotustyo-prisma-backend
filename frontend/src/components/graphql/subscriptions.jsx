import { gql } from "@apollo/client";

export const MESSAGE_SENT_PUBSUB = gql`
  subscription Subscription($roomId: String!) {
    messageSent(roomId: $roomId) {
      id
      content
      createdAt
      author {
        username
        avatar
        id
      }
    }
  }
`;
