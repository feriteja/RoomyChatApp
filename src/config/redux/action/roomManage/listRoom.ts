import * as actions from '../index';
import {listUserRooms} from '@firebaseFunc';

export const listRooms = () => {
  return async (dispatch: any) => {
    try {
      const list = await listUserRooms();

      dispatch({type: actions.LISTUSERROOMS, payload: list});
    } catch (error) {}
  };
};
