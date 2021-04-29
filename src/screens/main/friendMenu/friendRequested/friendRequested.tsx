import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  listRequestedFriend,
  acceptRequestFriend,
  deleteRequestFriend,
} from '@firebaseFunc';
import {useNavigation} from '@react-navigation/core';
import {Gap, FriendRequestItem} from '@components';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {
  Transition,
  Transitioning,
  TransitioningView,
} from 'react-native-reanimated';

const friendRequested = () => {
  const [requestedList, setRequestedList] = useState<
    FirebaseFirestoreTypes.DocumentData[] | undefined
  >([]);

  const transRef = useRef<TransitioningView>();
  const navigation = useNavigation();

  const actionHandler = (targetUid: string) => {
    const newArr = requestedList?.filter(user => user.uid !== targetUid);
    setRequestedList(newArr);
    transRef.current?.animateNextTransition();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      listRequestedFriend().then(a => setRequestedList(a));
    });

    return unsubscribe;
  }, [navigation]);

  const transition = (
    <Transition.Sequence>
      <Transition.Out type="slide-left" />
      <Transition.Change interpolation="easeInOut" />
      <Transition.In type="fade" />
    </Transition.Sequence>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <Transitioning.View transition={transition} ref={transRef} style={{}}>
        {requestedList?.length === 0 ? (
          <View
            style={{
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>No request</Text>
          </View>
        ) : (
          <FlatList
            ItemSeparatorComponent={() => <Gap height={5} />}
            keyExtractor={(a, i) => i.toString()}
            data={requestedList}
            contentContainerStyle={{paddingBottom: 65}}
            renderItem={({item, index}) => (
              <FriendRequestItem
                item={item}
                index={index}
                actionHandler={actionHandler}
              />
            )}
          />
        )}
      </Transitioning.View>
    </View>
  );
};

export default friendRequested;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAFF',
  },
  header: {
    height: 20,
  },
});
