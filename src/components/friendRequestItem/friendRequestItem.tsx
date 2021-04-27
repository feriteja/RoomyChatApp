import {getProfileInfo} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
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
import IconMaticon from 'react-native-vector-icons/MaterialIcons';
import {deleteRequestFriend, acceptRequestFriend} from '@firebaseFunc';

interface props {
  item: any;
  index: number;
  actionHandler: (a: number) => void;
}

const {height, width} = Dimensions.get('screen');

const friendRequestItem: React.FC<props> = ({item, index, actionHandler}) => {
  const [userInfo, setUserInfo] = useState<
    FirebaseFirestoreTypes.DocumentData | undefined
  >({});

  const tranX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = tranX.value;
    },
    onActive: (event, ctx: any) => {
      if (event.translationX < -160) return;
      if (event.translationX < -20) {
        return (tranX.value = ctx.startX + event.translationX);
      }
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
            <View
              style={{
                position: 'absolute',
                backgroundColor: '#5cb85c',
                alignSelf: 'stretch',
                height: 90,
                width: 20,
                right: 0,
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              acceptRequestFriend({targetUid: item.uid}).then(a => {
                if (a === 'accepted') {
                  actionHandler(index);
                  tranX.value = 0;
                  ref.current?.animateNextTransition();
                }
              });
            }}>
            <View style={styles.section2}>
              <IconMaticon name="check-circle-outline" size={25} />
              <Text>Confirm</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              deleteRequestFriend({targetUid: item.uid}).then(a => {
                if (a === 'deleted') {
                  actionHandler(index);
                  tranX.value = 0;
                  ref.current?.animateNextTransition();
                }
              });
            }}>
            <View style={styles.section3}>
              <IconFeather name="delete" size={25} />
              <Text>Delete</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </Transitioning.View>
  );
};

export default friendRequestItem;

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
    backgroundColor: '#5cb85c',
    height: 90,
  },
  section3: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff548b',
    height: 90,
  },
});
