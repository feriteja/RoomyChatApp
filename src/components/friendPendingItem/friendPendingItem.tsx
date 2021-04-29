import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  Transition,
  Transitioning,
  TransitioningView,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import IconFeather from 'react-native-vector-icons/Feather';

import {getProfileInfo, cancelPendingFriend} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import useSWR from 'swr';

interface props {
  item: {uid: string} | FirebaseFirestoreTypes.DocumentData;
  index: number;
  cancleHandler: (targetUid: string) => void;
}

const {height, width} = Dimensions.get('screen');

const friendPendingItem: React.FC<props> = ({item, index, cancleHandler}) => {
  const {data: userInfo} = useSWR(item.uid, key => getProfileInfo({uid: key}));

  const tranX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = tranX.value;
    },
    onActive: (event, ctx: any) => {
      if (event.translationX < -80) return;
      if (event.translationX < -20)
        return (tranX.value = ctx.startX + event.translationX);
    },
    onEnd: event => {
      if (event.translationX <= -60) return (tranX.value = withSpring(-80));
      tranX.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: tranX.value}],
    };
  });

  return (
    <PanGestureHandler
      activeOffsetX={[-20, 20]}
      activeOffsetY={900}
      onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.section1}>
          <Image
            source={
              userInfo?.photoURL
                ? {uri: userInfo?.photoURL}
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
            }}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{fontWeight: 'bold', fontSize: 16}}>
              {userInfo?.name || `MyName is ${index}`}
            </Text>
            <Text>{userInfo?.signature || 'none'}</Text>
          </View>
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#ff548b',
              alignSelf: 'stretch',
              height: 90,
              width: 20,
              right: 0,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            cancelPendingFriend({targetUid: userInfo?.uid}).then(a => {
              if (a === 'deleted') {
                cancleHandler(userInfo?.uid);
                tranX.value = 0;
              }
            });
          }}>
          <View style={styles.section2}>
            <IconFeather name="delete" size={25} />
            <Text>Cancel</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default friendPendingItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    width: width + 70,
    height: 90,
  },
  imageAva: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  section1: {
    flexDirection: 'row',
    alignItems: 'center',
    width,
    backgroundColor: '#fff',
    height: 90,
    paddingHorizontal: 10,
    paddingLeft: 20,
    borderBottomStartRadius: 20,
    borderTopStartRadius: 20,
    elevation: 2,
  },
  section2: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff548b',
    height: 90,
    elevation: 2,
  },
});
