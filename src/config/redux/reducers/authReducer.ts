import {AnyAction} from 'redux';

const initialState = {auth: false, info: null};

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case 'LOGINAUTH':
      return {auth: true, info: action.payload};

    case 'LOGOUTAUTH':
      return {auth: false, info: null};

    default:
      return state;
  }
}
