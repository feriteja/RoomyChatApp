import React, {Ref, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {listMemberRoom} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import RoomMember from './roomMember';
import {roomActionBan, roomActionRemove} from '@firebaseFunc';
import useSWR from 'swr';
import {TransitioningView} from 'react-native-reanimated';

interface props {
  idRoom: string;
  admin: boolean;
  containerRef: React.MutableRefObject<TransitioningView | undefined>;
}

const roomMemberList: React.FC<props> = ({idRoom, admin, containerRef}) => {
  const {data: cacheListMember} = useSWR([idRoom, 'listMember'], key =>
    listMemberRoom({idRoom: key}),
  );

  const [listMember, setListMember] = useState(cacheListMember);

  const removeUserHandler = (targetUid: string) => {
    roomActionRemove({idRoom, targetUid}).then(a =>
      setListMember(oldArr => {
        const newArr = oldArr?.filter(member => member.uidUser !== targetUid);
        return newArr;
      }),
    );
    containerRef?.current?.animateNextTransition();
  };

  return (
    <>
      {listMember?.map((a, i) => (
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
