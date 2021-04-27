import {AnyAction} from 'redux';
import * as actions from '../../action/';

const initialState: [] = [];

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case actions.LISTUSERROOMS:
      return [...action.payload];

    default:
      return state;
  }
}
