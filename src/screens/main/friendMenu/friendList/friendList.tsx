import {FriendListItem, Gap} from '@components';
import {useNavigation} from '@react-navigation/core';

import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {listFriendList} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

const friendList = () => {
  const [friendData, setFriendData] = useState<
    FirebaseFirestoreTypes.DocumentData[] | undefined
  >([]);
  const [refresh, setRefresh] = useState(false);

  const navigation = useNavigation();

  const deleteHandler = (idx: number) => {
    setFriendData(a => {
      const newArr = a;
      newArr?.splice(idx, 1);
      return newArr;
    });
    setRefresh(a => !a);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      listFriendList().then(a => setFriendData(a));
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => navigation.navigate('friendSearch')}>
          <IconAnt name="adduser" size={25} style={{fontWeight: 'bold'}} />
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Add friend</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FlatList
          extraData={refresh}
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
      </View>
    </View>
  );
};

export default friendList;

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
  content: {},
});
