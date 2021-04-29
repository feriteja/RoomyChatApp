import React, {Ref, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {listMemberRoom} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import RoomMember from './roomMember';
import {roomActionBan, roomActionRemove} from '@firebaseFunc';
import useSWR, {mutate} from 'swr';
import {TransitioningView} from 'react-native-reanimated';

interface props {
  idRoom: string;
  admin: boolean;
  containerRef: React.MutableRefObject<TransitioningView | undefined>;
}

const roomMemberList: React.FC<props> = ({idRoom, admin, containerRef}) => {
  const {
    data: cacheListMember,
    mutate: mutateMemberList,
    isValidating,
  } = useSWR([idRoom, 'listMember'], key => listMemberRoom({idRoom: key}));

  const removeUserHandler = (targetUid: string) => {
    roomActionRemove({idRoom, targetUid}).then(a => {
      const newArr = cacheListMember?.filter(
        member => member.uidUser !== targetUid,
      );
      mutateMemberList(newArr, false);
      mutate([idRoom, 'listBan']);
      containerRef?.current?.animateNextTransition();
    });
  };

  // useEffect(() => {
  //   if (isValidating) {
  //     containerRef?.current?.animateNextTransition();
  //   }
  // }, [isValidating]);

  return (
    <>
      {cacheListMember?.map((a, i) => (
        <RoomMember
          key={a.uidUser}
          admin={admin}
          uidUser={a.uidUser}
          removeUserHandler={removeUserHandler}
        />
      ))}
    </>
  );
};

export default roomMemberList;

const styles = StyleSheet.create({});
