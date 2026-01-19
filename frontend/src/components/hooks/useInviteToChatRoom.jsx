import { useMutation } from "@apollo/client";
import { INVITETOCHATROOM } from "../graphql/mutations";

const useInviteToChatRoom = () => {
  const [mutate, result] = useMutation(INVITETOCHATROOM);
  const InviteToChatRoom = async ({ roomId, invitedId }) => {
    const data = await mutate({
      variables: {
        roomId: roomId,
        invitedId: invitedId,
      }
    });
    return data;
  };
  return [InviteToChatRoom, result];
};
export default useInviteToChatRoom;