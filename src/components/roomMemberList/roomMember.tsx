import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {getProfileInfo} from '@firebaseFunc';
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
import IconFa5 from 'react-native-vector-icons/FontAwesome5';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

interface props {
  uidUser: string;
  admin: boolean;
  removeUserHandler: (a: string) => void;
}

const {height, width} = Dimensions.get('screen');

const roomMember: React.FC<props> = ({uidUser, admin, removeUserHandler}) => {
  const [
    userInfo,
    setUserInfo,
  ] = useState<FirebaseFirestoreTypes.DocumentData>();

  const transition = (
    <Transition.Sequence>
      <Transition.Out type="scale" />
      <Transition.Change interpolation="easeInOut" />
      <Transition.In type="fade" />
    </Transition.Sequence>
  );

  useEffect(() => {
    getProfileInfo({uid: uidUser}).then(a => setUserInfo(a));
  }, [uidUser]);

  const ref = useRef<TransitioningView>(null);

  return (
    <Transitioning.View ref={ref} transition={transition}>
      <Animated.View style={[styles.container]}>
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
            <TouchableOpacity onPress={() => removeUserHandler(uidUser)}>
              <View style={styles.section2Action}>
                <IconFeather name="delete" size={15} />
                <Text style={{fontSize: 12}}>Remove</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[styles.section2Action, {backgroundColor: '#ccc'}]}>
                <IconFa5 name="ban" size={15} />
                <Text style={{fontSize: 12}}>Ban user</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </Transitioning.View>
  );
};

export default roomMember;

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
