import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, Image, Alert} from 'react-native';
import {
  PanGestureHandler,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Animated, {
  withTiming,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  Transition,
  Transitioning,
  TransitioningView,
} from 'react-native-reanimated';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {getProfileInfo, roomInviteFriend} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import useSWR from 'swr';

interface props {
  item: any;
  index: number;
  data: any;
}

const friendInviteItem: React.FC<props> = ({item, index, data}) => {
  const {data: userInfo} = useSWR(item.uid, key => getProfileInfo(key));

  const tranX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: tranX.value}],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
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
            {userInfo?.name || `MyName is ${index}`}
          </Text>
          <Text>{userInfo?.signature || 'none'}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          roomInviteFriend({
            idRoom: data.idRoom,
            targetUid: item.uid,
          }).then(() => Alert.alert('invited'));
        }}>
        <View style={styles.section2}>
          <IconAnt name="adduser" size={25} />
          <Text>Invite</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default friendInviteItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    height: 90,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageAva: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  section1: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingLeft: 20,
    flex: 1,
    elevation: 2,
    height: 90,
    backgroundColor: '#fff',
  },
  section2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5cd85c',
    height: 90,
    paddingHorizontal: 10,
  },
});
