import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {listBannedRoom} from '@firebaseFunc';
import {TransitioningView} from 'react-native-reanimated';

interface props {
  idRoom: string;
  admin: boolean;
  containerRef: React.MutableRefObject<TransitioningView | undefined>;
}

const roomBannedList: React.FC<props> = ({idRoom, containerRef, admin}) => {
  const [listBanned, setListBanned] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >();

  useEffect(() => {
    listBannedRoom({idRoom}).then(a => setListBanned(a));
  }, []);

  return (
    <>
      {listBanned?.map(a => (
        <Text>a</Text>
      ))}
    </>
  );
};

export default roomBannedList;

const styles = StyleSheet.create({});
