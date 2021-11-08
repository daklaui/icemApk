/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import Text from 'src/components/Text';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import {AuthContext} from 'src/utils/auth-context';
const Index = () => {
  const urlImage = require('src/assets/images/loginIcem.png');
  const [UserName, setUsername] = useState("Abdessalem")
  const [Password, setPassword] = useState("123456")
  const {signIn, isLoading, theme} = React.useContext(AuthContext);
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        keyboardVerticalOffset={50}
        behavior={"position"}> 
        <StatusBar hidden />
        <Image source={urlImage} style={styles.image} resizeMode="cover" />
        <View style={styles.content}>
          <Text medium h1 style={styles.text}>
            {'Start with Login !'}
          </Text>
          <Input
            label={'username'}
            value={UserName}
            onChangeText={setUsername}
            secondary
          />
          <Input
            label={'password'}
            value={Password}
            onChangeText={setPassword}
            secureTextEntry
            secondary
          />
          <Button
            loading={isLoading}
            title={'login'}
            onPress={() => signIn({UserName, Password})}
            containerStyle={styles.button}
          />
        </View>

      </KeyboardAvoidingView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  image: {
    marginVertical: 40,
    marginHorizontal: 26,

  },
  text: {
    marginTop: 10,
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    marginVertical: 15,
  },
});

export default Index;
