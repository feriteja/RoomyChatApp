import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';

import IconAnt from 'react-native-vector-icons/AntDesign';
import {
  getProfileInfo,
  roomInviteFriend,
  roomInviteFriendCancel,
} from '@firebaseFunc';
import useSWR, {mutate} from 'swr';

interface props {
  item: any;
  index: number;
  data: any;
}

const friendInviteItem: React.FC<props> = ({item, index, data}) => {
  const {data: userInfo} = useSWR(item.uid, key => getProfileInfo({uid: key}));
  const [isLoading, setIsLoading] = useState(false);

  const isMounted = useRef(false);

  const inviteHandler = () => {
    setIsLoading(true);
    roomInviteFriend({
      idRoom: data.idRoom,
      targetUid: item.uid,
    }).then(() => {
      mutate([data.idRoom, 'friendInvite']).then(() => {
        if (isMounted.current) setIsLoading(false);
      });
    });
  };

  const cancelInviteHandler = () => {
    setIsLoading(true);
    roomInviteFriendCancel({
      idRoom: data.idRoom,
      targetUid: item.uid,
    }).then(() => {
      mutate([data.idRoom, 'friendInvite']).then(() => {
        if (isMounted.current) setIsLoading(false);
      });
    });
  };

  const actionHandler = () => {
    item.status ? cancelInviteHandler() : inviteHandler();
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <View style={[styles.container]}>
      <View style={styles.section1}>
        <Image
          source={
            userInfo?.photoURL
              ? {uri: userInfo?.photoURL}
              : require('../../assets/avatar/ava.jpg')
          }
          style={styles.imageAva}
        />
        <View
          style={{
            marginLeft: 20,
            alignSelf: 'stretch',
            justifyContent: 'space-around',
            paddingVertical: 15,
          }}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{fontWeight: 'bold', fontSize: 16}}>
            {userInfo?.name || `MyName is ${index}`}
          </Text>
          <Text>{userInfo?.signature || 'none'}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => actionHandler()}>
        <View
          style={[
            styles.section2,
            {
              backgroundColor: isLoading
                ? '#aaa'
                : item.status
                ? '#ff548b'
                : '#5cd85c',
            },
          ]}>
          <IconAnt name="adduser" size={25} />
          <Text>{item.status ? 'Invited' : 'Invite'} </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default friendInviteItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    height: 90,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageAva: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  section1: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingLeft: 20,
    flex: 1,
    elevation: 2,
    height: 90,
    backgroundColor: '#fff',
  },
  section2: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    paddingHorizontal: 10,
  },
});
