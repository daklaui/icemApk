/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Image, FlatList, TouchableOpacity, StyleSheet, View } from 'react-native';
import Text from 'src/components/Text';
import Header from 'src/containers/Header';
import Icon from 'src/components/Icon';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from 'src/utils/auth-context';
import { TitreOfScreens, TypeScreens } from '../../configs/typeOfScreens';
import { getCountOfByEtat } from '../../services/of-services';
import { useIsFocused } from '@react-navigation/native';
const Index = () => {
  const navigation = useNavigation();
  const { user, signOut, userToken } = React.useContext(AuthContext);
  const [menu, setMenu] = useState([
    { id: 1, title: 'Of Lancer', color: '#FF4500', members: 6, image: 'https://img.icons8.com/color/70/000000/groups.png' },
  ]);
  const [menuAdmin, setMenuAdmin] = useState();
  useEffect(() => {
    let menu = [
      { id: 3, title: 'Of Lancer', color: '#191970', members: 0, image: 'https://img.icons8.com/color/70/000000/checklist.png' },
      { id: 4, title: 'Of Par Status', color: '#191970', members: 0, image: 'https://img.icons8.com/color/70/000000/checklist.png' },
      { id: 5, title: 'Of Annuler', color: '#00BFFF', members: 5, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 6, title: 'Of Historique', color: '#FF4500', members: '', image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 7, title: 'Of Reception pour la coupe', color: '#00BFFF', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 8, title: 'Of In Coupe', color: '#4682B4', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 9, title: 'Of Out Coupe', color: '#4682B4', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 10, title: 'Of In Scarmato', color: '#87CEEB', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 11, title: 'Of Out Scarmato', color: '#87CEEB', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 23, title: 'Of Confirmation Scarmato', color: '#87CEEB', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 12, title: 'Of In Sertissage', color: '#6A5ACD', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 13, title: 'Of Out Sertissage', color: '#6A5ACD', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 14, title: 'Of In Magasin fils', color: '#20B2AA', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 15, title: 'Of Out Magasin fils', color: '#20B2AA', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 16, title: 'Of In Preparation', color: '#008080', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 17, title: 'Of Out Preparation', color: '#008080', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 18, title: 'Of In SODURE UTRA-SON', color: '#87CEEB', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 19, title: 'Of Out SODURE UTRA-SON', color: '#87CEEB', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 20, title: 'Of In Assemblage', color: '#FF9966', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 21, title: 'Of Out Assemblage', color: '#FF9966', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
      { id: 22, title: 'Of Confirmation SODURE UTRA-SON', color: '#87CEEB', members: 0, image: 'https://img.icons8.com/color/70/000000/to-do.png' },
    ];
    if (user.idRole === 'Administarteur') {
      menu.push({ id: 1, title: 'Utilisateurs', color: '#FF4500', members: '', image: 'https://img.icons8.com/color/70/000000/groups.png' },
        { id: 2, title: 'Ajouter Utilisateur', color: '#4682B4', members: '', image: 'https://img.icons8.com/color/70/000000/add-user-male--v1.png' });
    }
    getCountOfByEtat(userToken).then((resp) => {
      resp.map((item) => {
        switch (item.statu.trim()) {
          case 'OfLancer': menu.find(p => p.id === 3).members = item.nomber; break;
          case 'OfByStatus': menu.find(p => p.id === 4).members = item.nomber; break;
          case 'Annuler': menu.find(p => p.id === 5).members = item.nomber; break;
          case 'CoupeReception': menu.find(p => p.id === 7).members = item.nomber; break;
          case 'IN_coupe': menu.find(p => p.id === 8).members = item.nomber; break;
          case 'Out_coupe': menu.find(p => p.id === 9).members = item.nomber; break;
          case 'IN_SCARMATO': menu.find(p => p.id === 10).members = item.nomber; break;
          case 'OUT_SCARMATO': menu.find(p => p.id === 11).members = item.nomber; break;
          case 'In_Sertissage': menu.find(p => p.id === 12).members = item.nomber; break;
          case 'Out_Sertissage': menu.find(p => p.id === 13).members = item.nomber; break;
          case 'IN_Magasin_fils': menu.find(p => p.id === 14).members = item.nomber; break;
          case 'Out_Magasin_fils': menu.find(p => p.id === 15).members = item.nomber; break;
          case 'IN_Preparation': menu.find(p => p.id === 16).members = item.nomber; break;
          case 'OUT_Preparation': menu.find(p => p.id === 17).members = item.nomber; break;
          case 'IN_UTRA_SON': menu.find(p => p.id === 18).members = item.nomber; break;
          case 'OUT_ULTRA_SON': menu.find(p => p.id === 19).members = item.nomber; break;
          case 'IN_Assemblage': menu.find(p => p.id === 20).members = item.nomber; break;
          case 'Out_Assemblage': menu.find(p => p.id === 21).members = item.nomber; break;
          case 'OUT_SCARMATO_Confirmed': menu.find(p => p.id === 23).members = item.nomber; break;

        }
      });
      setMenuAdmin(menu);
    });
  }, [useIsFocused()]);
  //console.log(user)
  const clickEventListener = item => {
    switch (item) {
      case 'Utilisateurs':
        navigation.navigate('ListUsers');
        break;
      case 'Ajouter Utilisateur':
        navigation.navigate('AddUser');
        break;
      case 'Of Lancer':
        navigation.navigate('OfLancer');

        break;
      case 'Of Par Status':
        navigation.navigate('OfUrgent');
        break;
      case 'Of Historique':
        navigation.navigate('historqueOf');
        break;
      case 'Of Annuler':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenAnnuler,
            TypeOfScreen: TypeScreens.Annuler,
          });
        break;
      case 'Of Reception pour la coupe':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenCoupeReception,
            TypeOfScreen: TypeScreens.CoupeReception,
          });
        break;
      case 'Of In Coupe':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenIN_coupe,
            TypeOfScreen: TypeScreens.IN_coupe,
          });
        break;
      case 'Of Out Coupe':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenOut_coupe,
            TypeOfScreen: TypeScreens.Out_coupe,
          });
        break;
      case 'Of In Sertissage':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenIn_Sertissage,
            TypeOfScreen: TypeScreens.In_Sertissage,
          });
        break;
      case 'Of Out Sertissage':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenOut_Sertissage,
            TypeOfScreen: TypeScreens.Out_Sertissage,
          });
        break;
      case 'Of In Magasin fils':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenIN_Magasin_fils,
            TypeOfScreen: TypeScreens.IN_Magasin_fils,
          });
        break;
      case 'Of Out Magasin fils':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenOut_Magasin_fils,
            TypeOfScreen: TypeScreens.Out_Magasin_fils,
          });
        break;
      case 'Of In Preparation':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenIN_Preparation,
            TypeOfScreen: TypeScreens.IN_Preparation,
          });
        break;
      case 'Of Out Preparation':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenOUT_Preparation,
            TypeOfScreen: TypeScreens.OUT_Preparation,
          });
        break;
      case 'Of In SODURE UTRA-SON':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenIN_UTRA_SON,
            TypeOfScreen: TypeScreens.IN_UTRA_SON,
          });
        break;
      case 'Of Out SODURE UTRA-SON':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenOUT_ULTRA_SON,
            TypeOfScreen: TypeScreens.OUT_ULTRA_SON,
          });
        break;
      case 'Of In Assemblage':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenIN_Assemblage,
            TypeOfScreen: TypeScreens.IN_Assemblage,
          });
        break;
      case 'Of Out Assemblage':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenOut_Assemblage,
            TypeOfScreen: TypeScreens.Out_Assemblage,
          });
        break;
      case 'Of Confirmation SODURE UTRA-SON':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenOUT_ULTRA_SONConfirmed,
            TypeOfScreen: TypeScreens.OUT_ULTRA_SON_Confirmed,
          });
        break;
      case 'Of In Scarmato':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenIN_SCARMATO,
            TypeOfScreen: TypeScreens.IN_SCARMATO,
          });
        break;
      case 'Of Out Scarmato':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenOUT_SCARMATO,
            TypeOfScreen: TypeScreens.OUT_SCARMATO,
          });
        break;
      case 'Of Confirmation Scarmato':
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: TitreOfScreens.ScreenOUT_SCARMATOConfirmed,
            TypeOfScreen: TypeScreens.OUT_SCARMATO_Confirmed,
          });
        break;
      default:
        break;
    }
  };
  return (
    <View style={styles.container}>
      <Header
        centerComponent={
          <Text h3 medium>
            {'Menu'}
          </Text>
        }
        rightComponent={
          <Icon
            name="exit-to-app"
            type="material-community"
            size={30}
            onPress={() => signOut()}
            isRotateRTL
          />
        }
      />
      <FlatList style={styles.list}
        contentContainerStyle={styles.listContainer}
        data={menuAdmin && menuAdmin.sort(function (a, b) {
          return a.id - b.id;
        })}
        horizontal={false}
        numColumns={2}
        keyExtractor={(item) => {
          return item.id;
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={[styles.card, { backgroundColor: item.color }]} onPress={() => { clickEventListener(item.title); }}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>

              </View>
              <Image style={styles.cardImage} source={{ uri: item.image }} />
              <View style={styles.cardFooter}>
                <Text style={styles.subTitle}>{item.members}</Text>
              </View>
            </TouchableOpacity>
          );
        }} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  list: {
    //paddingHorizontal: 5,
    backgroundColor: '#E6E6E6',
  },
  listContainer: {
    alignItems: 'center',
  },
  /******** card **************/
  card: {
    marginHorizontal: 2,
    marginVertical: 2,
    flexBasis: '48%',
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage: {
    height: 70,
    width: 70,
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subTitle: {
    marginTop: '10%',
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
    color: '#FFFFFF',
  },
  icon: {
    height: 20,
    width: 20,
  },
});

export default Index;
