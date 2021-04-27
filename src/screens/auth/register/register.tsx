import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CusLogFormInput, Gap} from '../../../components';
import {register as registerFunc} from '../../../utils/functions/firebase';

import authFirebase from '@react-native-firebase/auth';

const register = () => {
  const [sureName, setSureName] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passWord, setPassWord] = useState('');
  const [confirmPassWord, setConfirmPassWord] = useState('');
  const [emailValid, setEmailValid] = useState<null | boolean>(null);
  const [passwordValid, setPasswordValid] = useState<null | boolean>(null);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const navigation = useNavigation();

  const passwordValidFunc = () => {
    passWord.length > 8 ? setPasswordValid(true) : setPasswordValid(false);
  };

  const validateEmail = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmailValid(re.test(String(userName.trim()).toLowerCase()));
  };

  useEffect(() => {
    validateEmail();
    passwordValidFunc();
  }, [userName, passWord]);

  return (
    <View style={styles.container}>
      <View style={styles.formLogin}>
        <Text style={styles.title}>Register</Text>
        <Gap height={40} />
        {errorMessage && (
          <Text style={{textAlign: 'center', color: '#cc0000', fontSize: 19}}>
            {errorMessage}
          </Text>
        )}
        <CusLogFormInput
          valid={sureName.length > 0}
          placeholder="Name"
          value={a => setSureName(a)}
        />
        <CusLogFormInput
          type="email"
          valid={emailValid}
          placeholder="Email"
          value={a => setUserName(a)}
        />
        <CusLogFormInput
          valid={phoneNumber.length > 5}
          placeholder="Phone"
          keyboardType="phone-pad"
          value={a => setPhoneNumber(a)}
        />
        <CusLogFormInput
          valid={passwordValid}
          placeholder="Password"
          type="password"
          value={a => setPassWord(a)}
        />
        <CusLogFormInput
          valid={confirmPassWord === passWord}
          placeholder="Confirm password"
          type="password"
          value={a => setConfirmPassWord(a)}
        />
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#0276F0'}]}
          onPress={() =>
            registerFunc({
              username: userName.trim(),
              password: passWord,
              confirmPassword: confirmPassWord,
              name: sureName,
              phone: phoneNumber,
            }).then(a =>
              a === 'Success'
                ? navigation.replace('verify')
                : setErrorMessage(a),
            )
          }>
          <Text style={{fontWeight: 'bold', color: '#ddd'}}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  formLogin: {},
  title: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 7,
    borderWidth: 0.5,
  },
});
