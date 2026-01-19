import { useMutation } from "@apollo/client";
import { REGISTER } from "../graphql/mutations";

const useRegister = () => {
  const [mutate, result] = useMutation(REGISTER);
  const register = async ({ Username, Password, Email }) => {
    const { data } = await mutate({
      variables: { password: Password, username: Username, email: Email },
    });
    return data;
  };

  return [register, result];
};
export default useRegister;
