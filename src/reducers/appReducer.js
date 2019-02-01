import { handleActions } from "redux-actions";

const initialState = {
  firebase: null,
  authUser: null
};

export default handleActions(
  {
    AUTH_USER_SET: (state, { payload: authUser }) => ({
      ...state,
      authUser
    })
  },
  initialState
);
