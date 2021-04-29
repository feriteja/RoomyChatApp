import {FriendListItem, Gap} from '@components';
import {useNavigation} from '@react-navigation/core';

import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {listFriendList, deleteFriend} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {
  Transition,
  Transitioning,
  TransitioningView,
} from 'react-native-reanimated';

const friendList = () => {
  const [friendData, setFriendData] = useState<
    FirebaseFirestoreTypes.DocumentData[] | undefined
  >([]);

  const TransRef = useRef<TransitioningView>();

  const navigation = useNavigation();

  const deleteHandler = async (targetUid: string) => {
    const isDeleted = await deleteFriend({targetUid});
    if (isDeleted) {
      const newArr = friendData?.filter(user => user.uid !== targetUid);
      setFriendData(newArr);
      TransRef.current?.animateNextTransition();
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      listFriendList().then(a => setFriendData(a));
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
      <View style={styles.header}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => navigation.navigate('friendSearch')}>
          <IconAnt name="adduser" size={25} style={{fontWeight: 'bold'}} />
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>Add friend</Text>
        </TouchableOpacity>
      </View>
      <Transitioning.View
        transition={transition}
        ref={TransRef}
        style={styles.content}>
        <FlatList
          ItemSeparatorComponent={() => <Gap height={5} />}
          keyExtractor={(a, i) => i.toString()}
          data={friendData}
          contentContainerStyle={{paddingBottom: 65}}
          renderItem={({item, index}) => (
            <FriendListItem
              item={item}
              index={index}
              deleteHandler={deleteHandler}
            />
          )}
        />
      </Transitioning.View>
    </View>
  );
};

export default friendList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    elevation: 6,
    paddingHorizontal: 20,
  },
  content: {},
});
