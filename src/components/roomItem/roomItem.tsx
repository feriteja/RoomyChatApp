import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {messageIntf} from '../../data/interfaceType';
import {unixToTimeHM} from '../../utils/functions/time';

import {getRoomHeadInfo, getProfileInfo} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

interface props {
  index: number;
  item: {idRoom: string} | FirebaseFirestoreTypes.DocumentData;
}

interface lastMessage {
  message: string;
  time: number;
  from: string;
}

const index: React.FC<props> = ({item, index}) => {
  const [roomInfo, setRoomInfo] = useState<
    FirebaseFirestoreTypes.DocumentData | undefined
  >({});
  const [lastMessage, setLastMessage] = useState<
    lastMessage | FirebaseFirestoreTypes.DocumentData
  >({});

  const messageTime = unixToTimeHM({
    unix: lastMessage?.time,
  });

  useEffect(() => {
    getRoomHeadInfo({idRoom: item.idRoom}).then(info => {
      info?.lastMessage.onSnapshot(query => {
        getProfileInfo({uid: query?.docs[0]?.data()?.uidUser}).then(a =>
          setLastMessage({...query?.docs[0]?.data(), from: a?.name}),
        );
      });
      setRoomInfo(info?.roomInfo);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{uri: roomInfo?.photoURL}}
        style={styles.imageAvatar}
        resizeMethod="resize"
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{roomInfo?.name}</Text>
        <View style={{height: 5}} />
        <Text style={{color: '#888'}} numberOfLines={1}>
          {lastMessage?.message === undefined
            ? ''
            : `${lastMessage?.from}: ${lastMessage?.message}`}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={{color: '#888'}}>
          {messageTime == undefined ? '' : messageTime}
        </Text>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  content: {
    justifyContent: 'center',
    marginLeft: 10,
    flex: 1,
  },
  imageAvatar: {height: 60, width: 60, borderRadius: 30},
  info: {},
});
