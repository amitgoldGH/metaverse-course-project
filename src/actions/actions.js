import { LOGIN } from '../constants';

export const signInUser = (username, usertype) => ({
  type: LOGIN,
  username: username,
  usertype: usertype
});
