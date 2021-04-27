import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {listFriendList} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {FriendInviteItem, Gap} from '@components';

const roomInvite = ({route}: any) => {
  const [friendData, setFriendData] = useState<
    FirebaseFirestoreTypes.DocumentData[] | undefined
  >([]);
  const [refresh, setRefresh] = useState(false);

  const {item: data} = route.params;

  const navigation = useNavigation();

  useEffect(() => {
    listFriendList().then(a => setFriendData(a));
  }, []);

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconEntypo name="chevron-left" size={30} />
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{data?.name}</Text>
          </View>
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
            <FriendInviteItem item={item} data={data} index={index} />
          )}
        />
      </View>
    </View>
  );
};

export default roomInvite;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    height: 80,
  },
  content: {
    paddingHorizontal: 20,
  },
});
