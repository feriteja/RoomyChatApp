import {AnyAction} from 'redux';
import * as actionSTATE from '../../action/';

const initialState: [] = [];

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case actionSTATE.GETMEMBERLIST:
      return [...action.payload];

    case actionSTATE.REMOVEBANMEMBERLIST:
      const findIDX = state.findIndex(x => x.uidUser === action.uidUser);

      const addArrayNew: [] = [...state];
      if (findIDX >= 0) {
        addArrayNew[findIDX] = action.payload;
        return addArrayNew;
      } else {
        return [...state, {...action.payload}];
      }

    default:
      return state;
  }
}
