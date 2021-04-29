import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, Image} from 'react-native';
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
import IconFeather from 'react-native-vector-icons/Feather';
import {getProfileInfo} from '@firebaseFunc';
import useSWR from 'swr';

interface props {
  item: any;
  index: number;
  deleteHandler: (a: string) => void;
}

const {height, width} = Dimensions.get('screen');

const friendListItem: React.FC<props> = ({item, index, deleteHandler}) => {
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
    <View style={styles.container}>
      <View style={[styles.contentBack]}>
        <TouchableOpacity
          onPress={() => deleteHandler(item.uid)}
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
              userInfo?.photoURL
                ? {uri: userInfo.photoURL}
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
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default friendListItem;

const styles = StyleSheet.create({
  container: {
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
    paddingHorizontal: 10,
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
    left: 40,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '#ff548b',
    borderBottomStartRadius: 20,
    borderTopStartRadius: 20,
  },
});
