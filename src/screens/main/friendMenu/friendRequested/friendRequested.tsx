import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  listRequestedFriend,
  acceptRequestFriend,
  deleteRequestFriend,
} from '@firebaseFunc';
import {useNavigation} from '@react-navigation/core';
import {Gap, FriendRequestItem} from '@components';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

const friendRequested = () => {
  const [requestedList, setRequestedList] = useState<
    FirebaseFirestoreTypes.DocumentData[] | undefined
  >([]);
  const [refresh, setRefresh] = useState(false);

  const navigation = useNavigation();

  const actionHandler = (idx: number) => {
    setRequestedList(a => {
      const newArr = a;
      newArr?.splice(idx, 1);
      return newArr;
    });
    setRefresh(a => !a);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      listRequestedFriend().then(a => setRequestedList(a));
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Friend request</Text>
      </View>
      <View style={{}}>
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
            extraData={refresh}
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
      </View>
    </View>
  );
};

export default friendRequested;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    elevation: 6,
    paddingHorizontal: 20,
  },
});
