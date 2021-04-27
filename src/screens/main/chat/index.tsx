import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ImageProps,
  TextInput,
} from 'react-native';

import Animated, {
  Transition,
  Transitioning,
  TransitioningView,
} from 'react-native-reanimated';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {
  acceptRequestFriend,
  getChatMessages,
  getProfileInfo,
  myUid,
  sendMessage,
  getRoomHeadInfo,
  New_getRoomHeadInfo,
  New_getChatMessages,
} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/core';
import {enableScreens} from 'react-native-screens';
import firestore from '@react-native-firebase/firestore';
import useSWR from 'swr';
// enableScreens(false);
interface props {
  index: number;
  item: {idRoom: string};
}

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

const {width, height} = Dimensions.get('screen');

const ChatMessage = ({
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
                {uri: data?.photoURL} ||
                require('../../../assets/avatar/ava.jpg')
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

const InputSection = ({idRoom}: {idRoom: string}) => {
  const [MessageValue, setMessageValue] = useState('');
  const textInputRef = useRef<TextInput>(null);

  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingHorizontal: 30,
        paddingVertical: 10,
      }}>
      <View style={styles.inputContainer}>
        <IconEntypo name="circle-with-plus" color="#faa" size={30} />
        <TextInput
          ref={textInputRef}
          onChangeText={a => setMessageValue(a)}
          placeholderTextColor="#999"
          placeholder="Message..."
          multiline
          style={styles.inputStyle}
        />
        {MessageValue.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              sendMessage({idRoom, message: MessageValue});
              setMessageValue('');
              textInputRef?.current?.clear();
            }}>
            <Text
              style={{
                color: '#694BE2',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              Send
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const chat: React.FC<props> = ({route}: any) => {
  const navigation = useNavigation();

  const {item: items, index: indexParams}: props = route.params;

  const {data: roomInfo} = useSWR([items.idRoom, 'roomInfo'], key =>
    New_getRoomHeadInfo(key),
  );
  const {data: dataChat} = useSWR([items.idRoom, 'chatMessage'], key =>
    New_getChatMessages(key),
  );

  const [messages, setMessages] = useState(dataChat);

  useEffect(() => {
    const subscribe = firestore()
      .collection('rooms')
      .doc(items.idRoom)
      .collection('chat')
      .orderBy('time', 'desc')
      .onSnapshot(query => {
        const users: any = [];

        query.forEach(documentSnapshot => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setMessages(users);
        // transRef.current?.animateNextTransition();
      });

    return () => subscribe();
  }, []);

  const transition = (
    <Transition.Together>
      <Transition.In type="scale" />
      <Transition.Change interpolation="easeInOut" />
      <Transition.Out type="fade" />
    </Transition.Together>
  );

  return (
    <View style={styles.container}>
      <View style={styles.haeder}>
        <Image
          source={{uri: roomInfo?.roomInfo?.photoURL}}
          style={{height: 60, width: 60, borderRadius: 30}}
        />
        <Text style={{fontWeight: 'bold', fontSize: 16}}>
          {roomInfo?.roomInfo?.name}
        </Text>
        <View style={{position: 'absolute', right: 20}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('roomOption', {item: roomInfo.roomInfo})
            }>
            <IconEntypo name="dots-three-horizontal" size={25} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <FlatList
          data={messages}
          extraData={messages}
          initialNumToRender={20}
          // onEndReached={() => setNumLimit(a => a + 10)} // handle refresh
          // onEndReachedThreshold={0.2}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingVertical: 30,
          }}
          inverted
          keyExtractor={(item, index) => `${item?.key}`}
          renderItem={({item, index}) => (
            <ChatMessage
              item={item}
              nameCurrIdx={item?.uidUser}
              namePrevIdx={index > 0 ? messages[index - 1]?.uidUser : 'null'}
              nameNextIdx={
                index < messages?.length - 1
                  ? messages[index + 1]?.uidUser
                  : 'null'
              }
            />
          )}
        />
        <InputSection idRoom={items.idRoom} />
      </View>
    </View>
  );
};

export default chat;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#F7F7F7',
    borderRadius: 30,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  inputStyle: {
    flex: 1,
    color: '#000',
    maxHeight: 120,
    padding: 5,
    margin: 0,
  },
  container: {flex: 1},
  content: {
    flex: 1,
    backgroundColor: '#aaa',
  },
  header: {
    height: 80,
    justifyContent: 'center',
  },

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

  haeder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
