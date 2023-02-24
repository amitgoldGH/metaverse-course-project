const INITIAL_STATE = {
  authorizedUser: '',
  userType: ''
};

const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOGIN':
      console.log('REDUCER LOGIN ACTION, ', action.username, ' type: ', action.type);
      return { ...state, authorizedUser: action.username, userType: action.usertype };
    case 'LOGOUT':
      console.log('REDUCER LOGOUT, RESET STATE');
      return { ...state, authorizedUser: '', userType: '' };
    case 'SET_CLICK_MODE':
      console.log('REDUCER CHANGE CLICK MODE: ', action.clickMode);
      return { ...state, clickMode: action.clickMode };
    default:
      return state;
  }
};

export default rootReducer;
