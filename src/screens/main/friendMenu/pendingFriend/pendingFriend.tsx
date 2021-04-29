import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {listPendingFriend, cancelPendingFriend} from '@firebaseFunc';
import {useNavigation} from '@react-navigation/core';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {Gap, FriendRequestItem, FriendPendingtItem} from '@components';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

const requestingFriend = () => {
  const [pendingList, setPendingList] = useState<
    FirebaseFirestoreTypes.DocumentData[] | undefined
  >([]);

  const navigation = useNavigation();

  const cancleHandler = (targetUid: string) => {
    const newArr = pendingList?.filter(user => user.uid != targetUid);
    setPendingList(newArr);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      listPendingFriend().then(a => setPendingList(a));
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <View style={{}}>
        {pendingList?.length === 0 ? (
          <View
            style={{
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => navigation.navigate('friendSearch')}>
              <IconAnt name="adduser" size={25} style={{fontWeight: 'bold'}} />
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Add friend</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            ItemSeparatorComponent={() => <Gap height={5} />}
            keyExtractor={(a, i) => i.toString()}
            data={pendingList}
            contentContainerStyle={{paddingBottom: 65}}
            renderItem={({item, index}) => (
              <FriendPendingtItem
                cancleHandler={cancleHandler}
                item={item}
                index={index}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default requestingFriend;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FBFAFF',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    elevation: 6,
    paddingHorizontal: 20,
  },
});
