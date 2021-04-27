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
import {deleteFriend, getProfileInfo} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

interface props {
  item: any;
  index: number;
  deleteHandler: (a: number) => void;
}

const {height, width} = Dimensions.get('screen');

const friendListItem: React.FC<props> = ({item, index, deleteHandler}) => {
  const [userInfo, setUserInfo] = useState<
    FirebaseFirestoreTypes.DocumentData | undefined
  >({});
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

  const transition = (
    <Transition.Sequence>
      <Transition.Out type="scale" />
      <Transition.Change interpolation="easeInOut" />
      <Transition.In type="fade" />
    </Transition.Sequence>
  );

  useEffect(() => {
    getProfileInfo({uid: item.uid}).then(a => setUserInfo(a));
  }, []);

  const ref = useRef<TransitioningView>(null);

  return (
    <Transitioning.View ref={ref} transition={transition}>
      <PanGestureHandler
        activeOffsetX={[-20, 20]}
        activeOffsetY={900}
        onGestureEvent={gestureHandler}>
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
              deleteFriend({targetUid: item.uid}).then(a => {
                if (a === 'deleted') {
                  deleteHandler(index);
                  tranX.value = 0;
                  ref.current?.animateNextTransition();
                }
              });
            }}>
            <View style={styles.section2}>
              <IconFeather name="delete" size={25} />
              <Text>Delete</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </Transitioning.View>
  );
};

export default friendListItem;

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
    width,
    paddingHorizontal: 10,
    borderBottomStartRadius: 20,
    borderTopStartRadius: 20,
    alignItems: 'center',
    paddingLeft: 20,
    elevation: 2,
    height: 90,
    backgroundColor: '#fff',
  },
  section2: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff548b',
    height: 90,
  },
});
