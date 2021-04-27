import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {CusLogFormInput, Gap} from '../../../components';
import IconIon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {login as loginApp} from '@firebaseFunc';

const {height, width} = Dimensions.get('screen');

const login = () => {
  const [userName, setUserName] = useState('');
  const [passWord, setPassWord] = useState('');
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

  const loginFunc = async () => {
    try {
      const doLoginMessage = await loginApp({
        username: userName.trim(),
        password: passWord,
      });

      doLoginMessage === 'Success'
        ? navigation.reset({index: 0, routes: [{name: 'home'}]})
        : setErrorMessage(doLoginMessage);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  useEffect(() => {
    validateEmail();
    passwordValidFunc();
  }, [userName, passWord]);

  return (
    <View style={styles.container}>
      <View style={styles.formLogin}>
        <Text style={styles.title}>Login</Text>
        <Gap height={40} />
        {errorMessage && (
          <Text style={{textAlign: 'center', color: '#cc0000', fontSize: 19}}>
            {errorMessage}
          </Text>
        )}
        <CusLogFormInput
          valid={emailValid}
          placeholder="Email"
          type="email"
          value={a => setUserName(a)}
        />
        <CusLogFormInput
          valid={passwordValid}
          placeholder="Password"
          type="password"
          value={a => setPassWord(a)}
        />
        <TouchableOpacity
          onPress={() => loginFunc()}
          style={[styles.button, {backgroundColor: '#0276F0'}]}>
          <Text style={{fontWeight: 'bold', color: '#ddd'}}>Login</Text>
        </TouchableOpacity>
        <Gap height={10} />
        <Pressable onPress={() => navigation.navigate('forgot')}>
          <Text style={{color: '#000', alignSelf: 'center'}}>
            Forgot Password
          </Text>
        </Pressable>
      </View>
      <View style={styles.formOption}>
        <View style={{flexDirection: 'row'}}>
          <IconIon
            name="logo-google"
            size={30}
            style={{paddingHorizontal: 10}}
          />
          <IconIon
            name="logo-facebook"
            size={30}
            style={{paddingHorizontal: 10}}
          />
          <IconIon
            name="logo-twitter"
            size={30}
            style={{paddingHorizontal: 10}}
          />
        </View>
        <Gap height={20} />
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
          }}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('register')}>
            <Text style={{color: '#02a6F0'}}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  formLogin: {flex: 3, justifyContent: 'flex-end'},
  formOption: {flex: 2, justifyContent: 'flex-end'},
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
