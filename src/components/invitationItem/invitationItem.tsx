import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getRoomHeadInfo} from '@firebaseFunc';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconFeather from 'react-native-vector-icons/Feather';
import useSWR from 'swr';

interface props {
  idRoom: string;
  userActionAcceptInvite: (idRoom: string) => void;
  userActionRejectInvite: (idRoom: string) => void;
}

const invitationItem: React.FC<props> = ({
  idRoom,
  userActionAcceptInvite,
  userActionRejectInvite,
}) => {
  const {data: roomInfo} = useSWR([idRoom, 'roomHeadInfo'], key =>
    getRoomHeadInfo({idRoom: key}),
  );

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{uri: roomInfo?.roomInfo?.photoURL}}
          style={{height: 60, width: 60, borderRadius: 10}}
        />
        <Text style={{alignSelf: 'center', marginLeft: 10, fontSize: 14}}>
          {roomInfo?.roomInfo?.name}
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => userActionAcceptInvite(idRoom)}>
          <View style={styles.section2}>
            <IconEntypo name="check" size={20} />
            <Text style={{fontSize: 13}}>Accept</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => userActionRejectInvite(idRoom)}>
          <View style={[styles.section2, {backgroundColor: '#ff548b'}]}>
            <IconFeather name="delete" size={20} />
            <Text style={{fontSize: 13}}>Delete</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default invitationItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5cd85c',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
