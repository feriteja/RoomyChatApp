import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {listRequestedRoom} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import RoomRequest from './roomRequested';

import {roomActionAccept, roomActionReject} from '@firebaseFunc';
import {TransitioningView} from 'react-native-reanimated';
import useSWR, {mutate} from 'swr';

interface props {
  idRoom: string;
  admin: boolean;
  containerRef: React.MutableRefObject<TransitioningView | undefined>;
}

const roomRequestedList: React.FC<props> = ({idRoom, admin, containerRef}) => {
  const {data: cacheListRequest, mutate: mutateRequestList} = useSWR(
    [idRoom, 'listRequest'],
    key => listRequestedRoom({idRoom: key}),
  );

  const rejectHandler = (targetUid: string) => {
    roomActionReject({idRoom, targetUid}).then(a => {
      const newArr = cacheListRequest?.filter(
        member => member.uidUser !== targetUid,
      );
      mutateRequestList(newArr, false);

      containerRef?.current?.animateNextTransition();
    });
  };

  const acceptHander = (targetUid: string) => {
    roomActionAccept({idRoom, targetUid}).then(() => {
      const newArr = cacheListRequest?.filter(
        member => member.uidUser !== targetUid,
      );

      mutateRequestList(newArr, false);
      mutate([idRoom, 'listMember']);

      containerRef?.current?.animateNextTransition();
    });
  };

  return (
    <>
      {cacheListRequest?.map((a, i) => (
        <RoomRequest
          rejectHandler={rejectHandler}
          acceptHander={acceptHander}
          key={a.uidUser}
          admin={admin}
          uidUser={a.uidUser}
        />
      ))}
    </>
  );
};

export default roomRequestedList;

const styles = StyleSheet.create({});
