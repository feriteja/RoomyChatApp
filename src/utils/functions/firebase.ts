import auth from '@react-native-firebase/auth';
import fireStore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {loginIntf, registerIntf} from '../constant/interface';

const myUid = () => {
  return auth().currentUser?.uid;
};

const logout = async () => {
  try {
    auth().signOut();
    return null;
  } catch (error) {}
};

const login = async ({password, username}: loginIntf) => {
  const date = new Date();

  try {
    if (username === '' || password === '')
      return 'Please input the blank form';
    const authState = await auth().signInWithEmailAndPassword(
      username,
      password,
    );

    // if (!authState.user.emailVerified) {
    //   auth().signOut();
    //   return 'Please verify your email';
    // }

    await fireStore()
      .collection('user')
      .doc(authState.user.uid)
      .update({lastLogin: Math.round(date.getTime() / 1000)});

    return 'Success';
  } catch (error) {
    return 'Incorrect email or password';
  }
};

const register = async ({
  username,
  password,
  confirmPassword,
  name,
  phone,
}: registerIntf) => {
  const date = new Date();

  try {
    if (password !== confirmPassword) return 'Password not match';
    if (name === '' || phone === '' || username === '')
      return 'Please input the blank form';
    if (password.length < 9) return 'Password at least 9 characters long';

    const authState = await auth().createUserWithEmailAndPassword(
      username,
      password,
    );

    await authState.user.sendEmailVerification();

    await fireStore()
      .collection('user')
      .doc(authState.user.uid)
      .set({
        name,
        phone,
        uid: authState.user.uid,
        createdAt: Math.round(date.getTime() / 1000),
      });

    return 'Success';
  } catch (error) {
    return 'Email has been registered';
  }
};

//getProfilebyUID
const getProfileInfo = async ({
  uid = auth().currentUser?.uid,
}: {
  uid: string | undefined;
}) => {
  try {
    const data = await fireStore().collection('user').doc(uid).get();

    return data.data();
  } catch (error) {}
};

const New_getProfileInfo = async (uid = auth().currentUser?.uid) => {
  try {
    const data = await fireStore().collection('user').doc(uid).get();

    return data.data();
  } catch (error) {}
};

const getProfileByUsername = async ({username}: {username: string}) => {
  try {
    const user = await fireStore()
      .collection('user')
      .where('username', '==', username)
      .get();

    const data = await user.docs[0]?.data();

    console.log(data);

    return data;
  } catch (error) {}
};

const validRoomId = async ({idRoom}: {idRoom: string}) => {
  try {
    const data = await fireStore()
      .collection('rooms')
      .where('idRoom', '==', idRoom)
      .get();

    return data.empty;
  } catch (error) {
    console.log(error);
  }
};

const createRoomChat = async ({
  file = '',
  name = '',
  idRoom,
}: {
  file: string;
  name: string;
  idRoom: string;
}) => {
  const path = `photos/${idRoom}/roomAva.jpg`;
  const date = new Date();

  if (idRoom === '' || file === '') return 'Please input the blank fill';
  try {
    const isValid = await validRoomId({idRoom: idRoom});

    if (!isValid) return 'RoomID already exist';

    const fetchUri = await fetch(file);
    const blobUri = await fetchUri.blob();

    const sendFile = await storage().ref(path).put(blobUri);

    const fullPath = sendFile.metadata.fullPath;

    const getDownloadURL = await storage().ref(fullPath).getDownloadURL();

    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .set({
        photoURL: getDownloadURL,
        admin: myUid(),
        idRoom: idRoom,
        name: name,
        createdAt: Math.round(date.getTime() / 1000),
      });

    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('members')
      .doc(myUid())
      .set({uidUser: myUid()});

    await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('myRooms')
      .doc(idRoom)
      .set({idRoom});

    console.log('invok in func');

    return 'success';
  } catch (error) {
    return 'error';
  }
};

const validUsername = async ({username}: {username: string}) => {
  try {
    console.log('atas');
    const data = await fireStore()
      .collection('user')
      .where('username', '==', username)
      .get();

    return data.empty;
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async ({
  file,
  name,
  phone,
  userName,
  signature,
}: {
  file: string;
  name: string;
  phone: string;
  userName: string;
  signature: string;
}) => {
  const path = `photos/${auth().currentUser?.uid}/fotoProfile.jpg`;

  if (userName === '' || userName === null) return 'Please input the userName';
  try {
    const isValid = await validUsername({username: userName});

    if (!isValid) return 'Username already exist';

    const fetchUri = await fetch(file);
    const blobUri = await fetchUri.blob();

    const sendFile = await storage().ref(path).put(blobUri);

    const fullPath = sendFile.metadata.fullPath;

    const getDownloadURL = await storage().ref(fullPath).getDownloadURL();

    await auth().currentUser?.updateProfile({
      displayName: name,
      photoURL: getDownloadURL,
    });

    await fireStore().collection('user').doc(myUid()).update({
      photoURL: getDownloadURL,
      username: userName,
      phone,
      name,
      signature,
    });

    return 'success';
  } catch (error) {
    return 'error';
  }
};

const requestFriend = async ({targetUid}: {targetUid: string}) => {
  try {
    await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('pending')
      .doc(targetUid)
      .set({uid: targetUid});
    await fireStore()
      .collection('user')
      .doc(targetUid)
      .collection('requested')
      .doc(myUid())
      .set({uid: myUid()});

    return 'sent';
  } catch (error) {
    console.log(error);
  }
};

const cancelPendingFriend = async ({targetUid}: {targetUid: string}) => {
  try {
    await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('pending')
      .doc(targetUid)
      .delete();
    await fireStore()
      .collection('user')
      .doc(targetUid)
      .collection('requested')
      .doc(myUid())
      .delete();
    return 'deleted';
  } catch (error) {
    return 'error';
  }
};

const acceptRequestFriend = async ({targetUid}: {targetUid: string}) => {
  try {
    await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('requested')
      .doc(targetUid)
      .delete();
    await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('friendList')
      .doc(targetUid)
      .set({uid: targetUid});
    await fireStore()
      .collection('user')
      .doc(targetUid)
      .collection('pending')
      .doc(myUid())
      .delete();
    await fireStore()
      .collection('user')
      .doc(targetUid)
      .collection('friendList')
      .doc(myUid())
      .set({uid: myUid()});

    return 'accepted';
  } catch (error) {
    return 'error';
  }
};

const deleteRequestFriend = async ({targetUid}: {targetUid: string}) => {
  try {
    await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('requested')
      .doc(targetUid)
      .delete();
    await fireStore()
      .collection('user')
      .doc(targetUid)
      .collection('pending')
      .doc(myUid())
      .delete();
    return 'deleted';
  } catch (error) {
    return 'error';
  }
};

const deleteFriend = async ({targetUid}: {targetUid: string}) => {
  try {
    await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('friendList')
      .doc(targetUid)
      .delete();
    return 'deleted';
  } catch (error) {}
};

const listFriendList = async () => {
  try {
    const data = await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('friendList')
      .get();

    const list = data.docs.map(a => a.data());

    return list;
  } catch (error) {}
};

const listRequestedFriend = async () => {
  try {
    const data = await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('requested')
      .get();

    const listUID = data.docs.map(a => a.data());

    console.log('listRequestedFriend', listUID);

    return listUID;
  } catch (error) {}
};

const listPendingFriend = async () => {
  try {
    const data = await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('pending')
      .get();

    const listUID = data.docs.map(a => a.data());

    console.log('listPendingFriend ', listUID);
    return listUID;
  } catch (error) {}
};

const listUserRooms = async () => {
  try {
    const data = await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('myRooms')
      .get();

    const list = data.docs.map(a => a.data());

    return list;
  } catch (error) {
    return 'error/not found';
  }
};

const getRoomHeadInfo = async ({idRoom}: {idRoom: string}) => {
  try {
    const roomInfo = await fireStore().collection('rooms').doc(idRoom).get();
    const lastMessage = await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('chat')
      .orderBy('time', 'desc')
      .limit(1);

    return {lastMessage, roomInfo: roomInfo.data()};
  } catch (error) {}
};

const getChatMessages = ({
  idRoom,
  limit = 20,
}: {
  idRoom: string;
  limit?: number;
}) => {
  try {
    return fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('chat')
      .orderBy('time', 'desc');
    // .limit(limit);
  } catch (error) {
    console.log(error);
  }
};

const New_getChatMessages = async (idRoom: string) => {
  try {
    const data = await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('chat')
      .orderBy('time', 'desc')
      .get();

    const dataChat = data.docs.map((item, idx) => {
      return {...item.data(), key: item.id};
    });

    return dataChat;

    // .limit(limit);
  } catch (error) {
    console.log(error);
  }
};

const sendMessage = async ({
  idRoom,
  message,
}: {
  idRoom: string;
  message: string;
}) => {
  const date = new Date();
  try {
    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('chat')
      .add({
        message,
        time: Math.round(date.getTime() / 1000),
        uidUser: myUid(),
      });
    return;
  } catch (error) {
    console.log(error);
    console.log('error');
  }
};

const listRequestedRoom = async ({idRoom}: {idRoom: string}) => {
  const roomPath = fireStore()
    .collection('rooms')
    .doc(idRoom)
    .collection('requested');
  try {
    const data = await roomPath.get();

    const list = data.docs.map((a, i) => a.data());

    return list;
  } catch (error) {
    console.log(error);
  }
};

const listMemberRoom = async ({idRoom}: {idRoom: string}) => {
  const roomPath = fireStore()
    .collection('rooms')
    .doc(idRoom)
    .collection('members');
  try {
    const data = await roomPath.get();

    const list = data.docs.map((a, i) => a.data());

    return list;
  } catch (error) {
    console.log(error);
  }
};

const listBannedRoom = async ({idRoom}: {idRoom: string}) => {
  const roomPath = fireStore()
    .collection('rooms')
    .doc(idRoom)
    .collection('banned');
  try {
    const data = await roomPath.get();

    const list = data.docs.map((a, i) => a.data());

    return list;
  } catch (error) {
    console.log(error);
  }
};

const listRoomInvitation = async () => {
  try {
    const data = await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('roomInvitation')
      .get();

    const list = data.docs.map(a => a.data());

    return list;
  } catch (error) {
    console.log(error);
  }
};

const roomActionRemove = async ({
  idRoom,
  targetUid,
}: {
  idRoom: string;
  targetUid: string;
}) => {
  try {
    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('members')
      .doc(targetUid)
      .delete();
    await fireStore()
      .collection('user')
      .doc(targetUid)
      .collection('myRooms')
      .doc(idRoom)
      .delete();

    return 'deleted';
  } catch (error) {
    return 'error';
  }
};
const roomActionBan = async ({
  idRoom,
  targetUid,
}: {
  idRoom: string;
  targetUid: string;
}) => {
  try {
    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('members')
      .doc(targetUid)
      .delete();
    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('banned')
      .doc(targetUid)
      .set({uidUser: targetUid});
    await fireStore()
      .collection('user')
      .doc(targetUid)
      .collection('myRooms')
      .doc(idRoom)
      .delete();

    return 'banned';
  } catch (error) {
    return 'error';
  }
};
const roomActionAccept = async ({
  idRoom,
  targetUid,
}: {
  idRoom: string;
  targetUid: string;
}) => {
  try {
    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('requested')
      .doc(targetUid)
      .delete();
    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('members')
      .doc(targetUid)
      .set({uidUser: targetUid});

    await fireStore()
      .collection('user')
      .doc(targetUid)
      .collection('requestJoinRoom')
      .doc(idRoom)
      .delete();
    await fireStore()
      .collection('user')
      .doc(targetUid)
      .collection('myRooms')
      .doc(idRoom)
      .set({idRoom});

    return 'accepted';
  } catch (error) {
    return 'error';
  }
};

const roomActionReject = async ({
  idRoom,
  targetUid,
}: {
  idRoom: string;
  targetUid: string;
}) => {
  try {
    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('requested')
      .doc(targetUid)
      .delete();

    await fireStore()
      .collection('user')
      .doc(targetUid)
      .collection('requestJoinRoom')
      .doc(idRoom)
      .delete();

    return 'accepted';
  } catch (error) {
    return 'error';
  }
};

const roomInviteFriend = async ({
  targetUid,
  idRoom,
}: {
  idRoom: string;
  targetUid: string;
}) => {
  try {
    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('invite')
      .doc(targetUid)
      .set({uidUser: targetUid});

    await fireStore()
      .collection('user')
      .doc(targetUid)
      .collection('roomInvitation')
      .doc(idRoom)
      .set({idRoom});
  } catch (error) {}
};

const roomSearch = async ({idRoom}: {idRoom: string}) => {
  try {
    const data = await fireStore()
      .collection('rooms')
      .where('idRoom', '==', idRoom)
      .limit(1)
      .get();

    const dataResult = data.docs[0].data();

    const isRequested = await fireStore()
      .collection('rooms')
      .doc(dataResult.idRoom)
      .collection('requested')
      .doc(myUid())
      .get();

    const isMember = await fireStore()
      .collection('rooms')
      .doc(dataResult.idRoom)
      .collection('members')
      .doc(myUid())
      .get();

    console.log(isRequested.exists);

    return {
      data: dataResult,
      status: isMember.exists
        ? 'member'
        : isRequested.exists
        ? 'requested'
        : undefined,
    };
  } catch (error) {
    console.log(error);
  }
};

const roomRequestJoin = async ({idRoom}: {idRoom: string}) => {
  try {
    await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('requestJoinRoom')
      .doc(idRoom)
      .set({idRoom});

    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('requested')
      .doc(myUid())
      .set({uidUser: myUid()});

    return 'requested';
  } catch (error) {
    console.log(error);
  }
};
const roomRequestCancelJoin = async ({idRoom}: {idRoom: string}) => {
  try {
    await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('requestJoinRoom')
      .doc(idRoom)
      .delete();

    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('requested')
      .doc(myUid())
      .delete();

    return 'canceled';
  } catch (error) {
    return console.log(error);
  }
};

const userActionAcceptInvite = async ({idRoom}: {idRoom: string}) => {
  try {
    await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('roomInvitation')
      .doc(idRoom)
      .delete();
    await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('myRooms')
      .doc(idRoom)
      .set({idRoom});

    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('invite')
      .doc(myUid())
      .delete();
    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('members')
      .doc(myUid())
      .set({uidUser: myUid()});

    return 'joined';
  } catch (error) {}
};
const userActionRejectInvite = async ({idRoom}: {idRoom: string}) => {
  try {
    await fireStore()
      .collection('user')
      .doc(myUid())
      .collection('roomInvitation')
      .doc(idRoom)
      .delete();

    await fireStore()
      .collection('rooms')
      .doc(idRoom)
      .collection('invite')
      .doc(myUid())
      .delete();

    return 'rejected';
  } catch (error) {}
};

export {
  myUid,
  login,
  register,
  logout,
  getProfileInfo,
  New_getProfileInfo,
  updateProfile,
  validUsername,
  validRoomId,
  getProfileByUsername,
  requestFriend,
  cancelPendingFriend,
  listRequestedFriend,
  listFriendList,
  listUserRooms,
  listPendingFriend,
  listMemberRoom,
  listBannedRoom,
  listRequestedRoom,
  listRoomInvitation,
  acceptRequestFriend,
  deleteRequestFriend,
  deleteFriend,
  createRoomChat,
  getRoomHeadInfo,
  getChatMessages,
  New_getChatMessages,
  sendMessage,
  roomActionRemove,
  roomActionBan,
  roomActionAccept,
  roomActionReject,
  roomSearch,
  roomRequestJoin,
  roomRequestCancelJoin,
  roomInviteFriend,
  userActionAcceptInvite,
  userActionRejectInvite,
};
