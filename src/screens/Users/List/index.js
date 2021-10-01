/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from 'react-native';
import Text from 'src/components/Text';
import Icon from 'src/components/Icon';
import Header from 'src/containers/Header';
import * as themeColors from 'src/configs/themes';
import Swipeout from 'react-native-swipeout';
import { getAllUsers } from 'src/services/users-service';
const urlImage = require('src/assets/images/avatar7.png');
import { AuthContext } from 'src/utils/auth-context';
import { deleteUSer } from 'src/services/users-service';
import { useNavigation } from '@react-navigation/native';
import AnimatedLoader from 'react-native-animated-loader';
const Index = ({ navigation }) => {
  const { userToken, signOut } = React.useContext(AuthContext);
  const { colors } = themeColors.themeLight;
  const navigationD = useNavigation();
  const [visible, setVisible] = useState(true);
  const swipeoutBtns = (item) => {
    return [
      {
        text: 'Delete',
        autoClose: true,
        backgroundColor: colors.gray,
        type: 'delete',
        onPress: () => {
          deleteUSer(userToken, item.idUser).then((d) => {
            setIsRemove(!remove);
          });
        },
      },
      {
        text: 'Edit',
        autoClose: true,
        backgroundColor: colors.secondaryText,
        type: 'default',
        onPress: () => {
          navigationD.navigate('AddUser', { edit: true, id: item.idUser });
        },
      },
    ];
  };
  const [data, setData] = useState([]);
  // eslint-disable-next-line no-undef
  const [remove, setIsRemove] = useState(false);
  useEffect(() => {
    setVisible(true)
    getAllUsers(userToken).then((d) => {
      if (d.message && d.message === 'Unauthorized') {
        signOut();
      }
      setData([]);
      setData(d);
      setVisible(false)
    });

  }, [remove]);
  React.useEffect(() => {
    setVisible(true)
    const unsubscribe = navigation.addListener('focus', () => {
      getAllUsers(userToken).then((d) => {
        if (d.message && d.message === 'Unauthorized') {
          signOut();
        }
        setData([]);
        setData(d);
        setVisible(false)
      });
    });
    return unsubscribe;
  }, [navigation]);


  return (
    <View style={styles.container}>
      <Header
        leftComponent={
          <Icon
            name="chevron-left"
            type="material-community"
            size={30}
            onPress={() => navigation.goBack()}
            isRotateRTL
          />
        }
        centerComponent={
          <Text h3 medium>
            {'List Utlisateurs'}
          </Text>
        }
        rightComponent={
          <Icon
            name="exit-to-app"
            type="material-community"
            size={30}
            onPress={() => signOut()}
            isRotateRTL
          />}
      />
      <AnimatedLoader
        visible={visible}
        overlayColor="rgba(255,255,255,0.75)"
        animationStyle={styles.lottie}
        speed={1}>
      </AnimatedLoader>
      {!visible &&
        <KeyboardAvoidingView behavior="height" style={styles.keyboard}>

          <FlatList
            style={styles.userList}
            columnWrapperStyle={styles.listContainer}
            data={data}
            keyExtractor={(item) => {
              return item.id;
            }}
            renderItem={({ item }) => {
              return (
                <Swipeout style={{ backgroundColor: colors.background }} right={swipeoutBtns(item)}>
                  <View style={styles.card} >
                    <Image style={styles.image} source={urlImage} />
                    <View style={styles.cardContent}>
                      <Text style={styles.name}>{item.userName}</Text>
                      <Text style={styles.position}>{item.idRole}</Text>
                    </View>
                  </View>
                </Swipeout>
              );
            }}


          />
        </KeyboardAvoidingView>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    //backgroundColor: '#FFF',
  },
  keyboard: {
    flex: 1,
  },

  userList: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 20,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: 'white',

    padding: 10,
    flexDirection: 'row',
  },

  name: {
    fontSize: 18,
    flex: 1,
    alignSelf: 'center',
    color: '#008080',
    fontWeight: 'bold',
  },
  position: {
    fontSize: 14,
    flex: 1,
    alignSelf: 'center',
    color: '#696969',
  },
  content: {
    paddingHorizontal: 20,
  },
  box: {
    borderRadius: 8,
    //...shadowDefault,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    padding: 20,
    paddingRight: 5,
    marginTop: 10,
  },
  iconLogout: {
    padding: 5,
  },
  avatar: {
    //backgroundColor: gray2,
  },
  viewName: {
    flex: 1,
    marginHorizontal: 15,
  },
  textNameUser: {
    marginBottom: 2,
  },
  textHeading: {
    marginTop: 30,
    marginBottom: 10,
  },
  itemBox: {
    minHeight: 50,
    paddingLeft: 20,
    paddingRight: 10,
  },
  iconBox: {
    marginRight: 13,
  },
  rightBox: {
    flex: 1,
    minHeight: 50,
  },
  titleItemBox: {
    flex: 1,
  },
  nameLanguage: {
    marginRight: 6,
  },
  nameFooter: {
    marginVertical: 23,
  },
});

export default Index;
