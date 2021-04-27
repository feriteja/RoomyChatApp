import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {listMemberRoom} from '@firebaseFunc';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import RoomMember from './roomMember';
import {roomActionBan, roomActionRemove} from '@firebaseFunc';
interface props {
  idRoom: string;
  admin: boolean;
}

const roomMemberList: React.FC<props> = ({idRoom, admin}) => {
  const [listMember, setListMember] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >();

  const removeUserHandler = (targetUid: string) => {
    roomActionRemove({idRoom, targetUid}).then(a =>
      setListMember(a => {
        const newArr = a;

        const theIdx = newArr?.findIndex(x => x.uidUser === targetUid);

        newArr?.splice(theIdx, 1);

        return newArr;
      }),
    );
  };

  useEffect(() => {
    listMemberRoom({idRoom}).then(a => {
      setListMember(a);
    });
  }, [removeUserHandler]);

  return (
    <>
      {listMember?.map((a, i) => (
        <View key={i + 'member'}>
          <RoomMember
            key={i + 'member'}
            admin={admin}
            uidUser={a.uidUser}
            removeUserHandler={removeUserHandler}
          />
        </View>
      ))}
    </>
  );
};

export default roomMemberList;

const styles = StyleSheet.create({});
