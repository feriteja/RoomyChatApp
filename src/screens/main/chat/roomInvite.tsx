import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {listFriendList, roomWhoIsInvitedList} from '@firebaseFunc';

import {FriendInviteItem, Gap} from '@components';
import useSWR from 'swr';

const roomInvite = ({route}: any) => {
  const {item: data} = route.params;
  const {data: friendData} = useSWR([data.idRoom, 'friendInvite'], key =>
    friendDataListInvite(key),
  );

  console.log('friendData', friendData);

  const friendDataListInvite = async (idRoom: string) => {
    try {
      const invitedList = await roomWhoIsInvitedList({idRoom: idRoom});
      const friendList = await listFriendList();

      const list = friendList?.map(a => {
        if (invitedList?.some(user => user.uidUser === a.uid)) {
          return {...a, status: 'invited'};
        }
        return {...a, status: undefined};
      });
      return list;
    } catch (error) {}
  };

  const navigation = useNavigation();

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
