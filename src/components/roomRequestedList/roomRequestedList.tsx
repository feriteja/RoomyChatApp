import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {listRequestedRoom} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import RoomRequest from './roomRequested';

import {roomActionAccept, roomActionReject} from '@firebaseFunc';

interface props {
  idRoom: string;
  admin: boolean;
}

const roomRequestedList: React.FC<props> = ({idRoom, admin}) => {
  const [listUser, setListUser] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);

  const rejectHandler = (targetUid: string) => {
    roomActionReject({idRoom, targetUid}).then(a =>
      setListUser(a => {
        const newArr = a;

        const theIdx = newArr?.findIndex(x => x.uidUser === targetUid);

        newArr?.splice(theIdx, 1);

        return newArr;
      }),
    );
  };

  const acceptHander = (targetUid: string) => {
    roomActionAccept({idRoom, targetUid}).then(() => {});
  };

  useEffect(() => {
    listRequestedRoom({idRoom}).then(a => setListUser(a));
  }, [acceptHander, roomActionReject]);

  return (
    <>
      {listUser.map((a, i) => (
        <RoomRequest
          rejectHandler={rejectHandler}
          acceptHander={acceptHander}
          key={i + 'member'}
          admin={admin}
          uidUser={a.uidUser}
        />
      ))}
    </>
  );
};

export default roomRequestedList;

const styles = StyleSheet.create({});
