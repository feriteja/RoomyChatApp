import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getRoomHeadInfo} from '@firebaseFunc';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconFeather from 'react-native-vector-icons/Feather';
import useSWR from 'swr';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

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
  const tranX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = tranX.value;
    },
    onActive: (event, ctx: any) => {
      if (ctx.startX <= -140) return;
      if (event.translationX < -160) return;
      if (event.translationX < -20)
        return (tranX.value = ctx.startX + event.translationX);
    },
    onEnd: event => {
      if (event.translationX <= -60) return (tranX.value = withSpring(-160));
      tranX.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: tranX.value}],
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.contentBack]}>
        <View style={{flex: 1}} />
        <TouchableOpacity
          onPress={() => userActionAcceptInvite(idRoom)}
          style={[styles.deleteButton, {backgroundColor: '#aaffaa'}]}>
          <IconFeather name="check" size={25} />
          <Text>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => userActionRejectInvite(idRoom)}
          style={styles.deleteButton}>
          <IconFeather name="delete" size={25} />
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
      <PanGestureHandler
        activeOffsetX={[-20, 20]}
        activeOffsetY={900}
        onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.section1, animatedStyle]}>
          <Image
            source={
              roomInfo?.roomInfo?.photoURL
                ? {uri: roomInfo?.roomInfo?.photoURL}
                : require('../../assets/avatar/ava.jpg')
            }
            style={styles.imageAva}
          />
          <View
            style={{
              marginLeft: 20,
              alignSelf: 'stretch',
              justifyContent: 'space-around',
              paddingVertical: 15,
              flex: 1,
            }}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{fontWeight: 'bold', fontSize: 16}}>
              {roomInfo?.roomInfo?.name || `Room`}
            </Text>
            <Text>{roomInfo?.roomInfo?.signature || 'none'}</Text>
          </View>
          <View style={{backgroundColor: '#aaa', width: 10, height: 90}} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default invitationItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    paddingLeft: 10,
    height: 90,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 90,
  },
  imageAva: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  section1: {
    flex: 1,
    flexDirection: 'row',
    borderBottomStartRadius: 20,
    borderTopStartRadius: 20,
    alignItems: 'center',
    paddingLeft: 20,
    elevation: 2,
    height: 90,
    backgroundColor: '#fff',
  },
  contentBack: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'stretch',
    left: 40,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '#ff548b',
    borderBottomStartRadius: 20,
    borderTopStartRadius: 20,
  },
});
