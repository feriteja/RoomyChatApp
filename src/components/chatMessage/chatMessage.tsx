import {getProfileInfo, myUid} from '@firebaseFunc';
import React from 'react';
import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import useSWR from 'swr';

const {height, width} = Dimensions.get('screen');

interface messageContent {
  item: {
    uidUser: string;
    time: number;
    message: string;
    key: string;
  };
  nameCurrIdx: string;
  namePrevIdx: string;
  nameNextIdx: string;
}

const chatMessage = ({
  item,
  nameCurrIdx,
  namePrevIdx,
  nameNextIdx,
}: messageContent) => {
  const {data} = useSWR(item.uidUser, key => getProfileInfo({uid: key}));

  return (
    <View style={{}}>
      <View
        style={[styles.messageStyle(namePrevIdx, nameCurrIdx, nameNextIdx)]}>
        <View style={{flexDirection: 'row'}}>
          {nameCurrIdx !== myUid() && (
            <Image
              source={
                data?.photoURL
                  ? {uri: data?.photoURL}
                  : require('../../assets/avatar/ava.jpg')
              }
              style={{
                height: 35,
                width: 35,
                borderRadius: 35 / 2,
                opacity: nameCurrIdx === namePrevIdx ? 0 : 1,
                alignSelf: 'flex-end',
                marginRight: 7,
              }}
            />
          )}
          <View
            style={styles.messageTextContainer(
              namePrevIdx,
              nameCurrIdx,
              nameNextIdx,
            )}>
            <Text
              accessible
              style={{color: nameCurrIdx == 'me' ? 'white' : 'black'}}>
              {item?.message}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default chatMessage;

const styles = StyleSheet.create({
  messageTextContainer: (prev, current, next) => ({
    backgroundColor: current === myUid() ? '#694BE2' : '#dadada',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderTopEndRadius: current === myUid() ? (current !== next ? 20 : 5) : 5,

    borderTopStartRadius: current !== myUid() ? (current === next ? 5 : 20) : 5,
    borderBottomStartRadius:
      current !== myUid() ? (current === prev ? 5 : 20) : 5,
    borderBottomEndRadius:
      current === myUid() ? (current === prev ? 5 : 20) : 5,
  }),
  messageStyle: (prev, current, next) => ({
    marginVertical: current === prev ? 2 : current === next ? 2 : 15,
    maxWidth: width * (3 / 4),
    alignSelf: current === myUid() ? 'flex-end' : 'flex-start',
  }),
});
