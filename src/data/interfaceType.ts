import {ImageURISource} from 'react-native';

export interface messageIntf {
  idRoom: string;
  member: string[];
  avatar: ImageURISource;
  data: {
    name: string;
    time: number;
    message: string;
  }[];
}
