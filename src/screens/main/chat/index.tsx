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
  New_getChatMessages,
} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/core';
import {enableScreens} from 'react-native-screens';
import firestore from '@react-native-firebase/firestore';
import useSWR, {mutate} from 'swr';

import {ChatMessage} from '@components';

interface props {
  index: number;
  item: {idRoom: string};
}

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

  const isMounted = useRef(false);

  const transRef = useRef<TransitioningView>();

  const {item: items, index: indexParams}: props = route.params;

  const {data: roomInfo} = useSWR([items.idRoom, 'roomInfo'], key =>
    getRoomHeadInfo({idRoom: key}),
  );
  const {data: messages, mutate: mutateChat} = useSWR(
    [items.idRoom, 'chatMessage'],
    key => New_getChatMessages(key),
  );

  // const [messages, setMessages] = useState(dataChat);

  const transition = (
    <Transition.Sequence>
      <Transition.Out type="fade" />
      <Transition.In type="fade" />
      <Transition.Change interpolation="easeInOut" />
    </Transition.Sequence>
  );

  useEffect(() => {
    isMounted.current = true;
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

        // setMessages(users);

        if (isMounted) {
          mutateChat(users);
          // transRef.current?.animateNextTransition();
        }
      });

    return () => subscribe();
  }, []);

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
            disabled={!roomInfo}
            onPress={() =>
              navigation.navigate('roomOption', {item: roomInfo?.roomInfo})
            }>
            <IconEntypo name="dots-three-horizontal" size={25} />
          </TouchableOpacity>
        </View>
      </View>
      <Transitioning.View
        ref={transRef}
        transition={transition}
        style={styles.content}>
        <FlatList
          data={messages}
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
      </Transitioning.View>
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

  haeder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
