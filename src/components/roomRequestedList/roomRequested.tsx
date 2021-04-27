import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  Transition,
  Transitioning,
  TransitioningView,
  TransitioningViewProps,
} from 'react-native-reanimated';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconFeather from 'react-native-vector-icons/Feather';
import useSWR from 'swr';
import {getProfileInfo} from '@firebaseFunc';

interface props {
  uidUser: string;
  admin: boolean;
  acceptHander: (uidUser: string) => void;
  rejectHandler: (uidUser: string) => void;
}

const roomRequested: React.FC<props> = ({
  uidUser,
  admin,
  acceptHander,
  rejectHandler,
}) => {
  const {data: userInfo} = useSWR(uidUser, key => getProfileInfo({uid: key}));

  return (
    <View style={[styles.container]}>
      <View style={styles.section1}>
        <Image source={{uri: userInfo?.photoURL}} style={styles.imageAva} />
        <View
          style={{
            marginLeft: 20,
            alignSelf: 'stretch',
            justifyContent: 'space-around',
            paddingVertical: 15,
          }}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{fontWeight: 'bold', fontSize: 16}}>
            {userInfo?.name || ''}
          </Text>
          <Text>{userInfo?.signature || 'none'}</Text>
        </View>
      </View>
      {admin && (
        <View style={styles.section2}>
          <TouchableOpacity onPress={() => acceptHander(uidUser)}>
            <View style={[styles.section2Action, {backgroundColor: '#5cd85c'}]}>
              <IconEntypo name="check" size={15} />
              <Text style={{fontSize: 12}}>Accept</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => rejectHandler(uidUser)}>
            <View style={[styles.section2Action, {backgroundColor: '#ccc'}]}>
              <IconFeather name="delete" size={15} />
              <Text style={{fontSize: 12}}>remove</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default roomRequested;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',

    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageAva: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  section1: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderBottomStartRadius: 20,
    borderTopStartRadius: 20,
    alignItems: 'center',
    height: 90,
  },
  section2: {
    alignSelf: 'stretch',
    justifyContent: 'space-around',
  },
  section2Action: {
    alignSelf: 'stretch',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff548b',
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
});
