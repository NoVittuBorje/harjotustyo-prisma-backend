import { useQuery } from "@apollo/client";
import { GET_CHAT_MESSAGES } from "../graphql/queries";
import { MESSAGE_SENT_PUBSUB } from "../graphql/subscriptions";
import { useEffect } from "react";

function ChatMessageData({ roomId }) {
  const { subscribeToMore, fetchMore, ...result } = useQuery(
    GET_CHAT_MESSAGES,
    {
      variables: { roomId: roomId, offset: 0 },
    }
  );
  const handleFetchMore = ({ offset }) => {
    fetchMore({
      variables: {
        roomId: roomId,
        offset: offset,
      },
    });
  };

  useEffect(() => {
    if (result.data) {
      const unsubscribe = subscribeToMore({
        document: MESSAGE_SENT_PUBSUB,
        variables: { roomId: roomId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          const newFeedItem = [
            subscriptionData.data.messageSent,
            ...prev.getMessages,
          ];

          const newmessages = Object.assign({}, prev, {
            getMessages: newFeedItem,
          });

          return newmessages;
        },
      });

      return () => {
        unsubscribe();
      };
    }
  }, [result, roomId, subscribeToMore]);

  return { handleFetchMore, ...result };
}
export default ChatMessageData;
