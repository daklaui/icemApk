/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import Text from 'src/components/Text';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import Header from 'src/containers/Header';
import Icon from 'src/components/Icon';
import { colors } from 'react-native-elements';
import { updateStateOf } from '../../../services/of-services';
import { AuthContext } from 'src/utils/auth-context';
import { TitreOfScreens, TypeScreens } from '../../../configs/typeOfScreens';
import SweetAlert from 'react-native-sweet-alert';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getDateCustom } from 'src/utils/time';
const index = (props) => {
  const { navigation, route } = props;
  const { userToken, user } = React.useContext(AuthContext);
  const item = route?.params?.item ?? null;
  const ListCommantaires = route?.params?.ListCommantaires ?? null;
  const [loader, setLoader] = useState(false);
  const [qty, setQty] = useState(item.trackOf.qtProduire);
  const [cmntr, setCmntr] = useState('');
  const [isNotValidForm, setIsNotValidForm] = useState(true);
  const [historique, setHistorique] = useState(ListCommantaires);

  useEffect(() => {
    console.log(user);
    if (cmntr && cmntr.length > 0 && qty && qty.toString().length > 0) {
      setIsNotValidForm(false);
    } else {
      setIsNotValidForm(true);
    }

  }, [cmntr, qty]);
  const ListCommantairesFn = () => useMemo(
    () => {
      console.log(historique);
      return <View style={{ paddingHorizontal: '7%' }}>
        {
          historique.map((item) => {
            return item.trackOf.commentaire && item.trackOf.commentaire.length > 0 ?
            <><TouchableOpacity key={item.trackOf.dateAction} style={[styles.card]}>
                <View style={styles.cardContent}>
                  <View style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                    <Text style={[styles.titre]}>{item.trackOf.actionneur}</Text>
                    <Text style={[styles.titreSourceN]}>{item.trackOf.etat}</Text>
                  </View>
                  <Text style={[styles.description]}>{item.trackOf.commentaire}</Text>
                </View>
              </TouchableOpacity></>
              : null;
          })
        }
      </View>;
    },
    []
  );

  const nextEtatOf = (etat) => {
    switch (etat) {
      case TypeScreens.Annuler: return 'CoupeReception';
      case TypeScreens.CoupeReception: return 'IN_coupe';
      case TypeScreens.IN_coupe: return 'Out_coupe';
      case TypeScreens.Out_coupe: return 'In_Sertissage';
      case TypeScreens.In_Sertissage: return 'Out_Sertissage';
      case TypeScreens.Out_Sertissage: return 'IN_Magasin_fils';
      case TypeScreens.IN_Magasin_fils: return 'Out_Magasin_fils';
      case TypeScreens.Out_Magasin_fils: return 'IN_Preparation';
      case TypeScreens.IN_Preparation: return 'OUT_Preparation';
      case TypeScreens.OUT_Preparation: return 'IN_Assemblage';
      case TypeScreens.IN_UTRA_SON: return 'OUT_ULTRA_SON';
      case TypeScreens.OUT_ULTRA_SON: return 'OUT_ULTRA_SON_Confirmed';
      case TypeScreens.IN_SCARMATO: return 'OUT_SCARMATO';
      case TypeScreens.OUT_SCARMATO: return 'OUT_SCARMATO_Confirmed';
      case TypeScreens.IN_Assemblage: return 'Out_Assemblage';
      case TypeScreens.Out_Assemblage: return 'produitFini';
      default: return '';
    }
  };

  const screenToBack = (etat) => {
    switch (etat) {
      case TypeScreens.Annuler: return {
        titreOfScreen: TitreOfScreens.ScreenAnnuler,
        TypeOfScreen: TypeScreens.Annuler,
      };
      case TypeScreens.CoupeReception: return {
        titreOfScreen: TitreOfScreens.ScreenCoupeReception,
        TypeOfScreen: TypeScreens.CoupeReception,
      };
      case TypeScreens.IN_coupe: return {
        titreOfScreen: TitreOfScreens.ScreenIN_coupe,
        TypeOfScreen: TypeScreens.IN_coupe,
      };
      case TypeScreens.Out_coupe: return {
        titreOfScreen: TitreOfScreens.ScreenOut_coupe,
        TypeOfScreen: TypeScreens.Out_coupe,
      };
      case TypeScreens.In_Sertissage: return {
        titreOfScreen: TitreOfScreens.ScreenIn_Sertissage,
        TypeOfScreen: TypeScreens.In_Sertissage,
      };
      case TypeScreens.Out_Sertissage: return {
        titreOfScreen: TitreOfScreens.ScreenOut_Sertissage,
        TypeOfScreen: TypeScreens.Out_Sertissage,
      };
      case TypeScreens.IN_Magasin_fils: return {
        titreOfScreen: TitreOfScreens.ScreenIN_Magasin_fils,
        TypeOfScreen: TypeScreens.IN_Magasin_fils,
      };
      case TypeScreens.Out_Magasin_fils: return {
        titreOfScreen: TitreOfScreens.ScreenOut_Magasin_fils,
        TypeOfScreen: TypeScreens.Out_Magasin_fils,
      };
      case TypeScreens.IN_Preparation: return {
        titreOfScreen: TitreOfScreens.ScreenIN_Preparation,
        TypeOfScreen: TypeScreens.IN_Preparation,
      };
      case TypeScreens.OUT_Preparation: return {
        titreOfScreen: TitreOfScreens.ScreenOUT_Preparation,
        TypeOfScreen: TypeScreens.OUT_Preparation,
      };
      case TypeScreens.IN_UTRA_SON: return {
        titreOfScreen: TitreOfScreens.ScreenIN_UTRA_SON,
        TypeOfScreen: TypeScreens.IN_UTRA_SON,
      };
      case TypeScreens.OUT_ULTRA_SON: return {
        titreOfScreen: TitreOfScreens.ScreenOUT_ULTRA_SON,
        TypeOfScreen: TypeScreens.OUT_ULTRA_SON,
      };
      case TypeScreens.OUT_ULTRA_SON_Confirmed: return {
        titreOfScreen: TitreOfScreens.ScreenOUT_ULTRA_SONConfirmed,
        TypeOfScreen: TypeScreens.OUT_ULTRA_SON_Confirmed,
      };
      case TypeScreens.IN_Assemblage: return {
        titreOfScreen: TitreOfScreens.ScreenIN_Assemblage,
        TypeOfScreen: TypeScreens.IN_Assemblage,
      };
      case TypeScreens.Out_Assemblage: return {
        titreOfScreen: TitreOfScreens.ScreenOut_Assemblage,
        TypeOfScreen: TypeScreens.Out_Assemblage,
      };
      case TypeScreens.IN_SCARMATO: return {
        titreOfScreen: TitreOfScreens.ScreenIN_SCARMATO,
        TypeOfScreen: TypeScreens.IN_SCARMATO,
      };
      case TypeScreens.OUT_SCARMATO: return {
        titreOfScreen: TitreOfScreens.ScreenOUT_SCARMATO,
        TypeOfScreen: TypeScreens.OUT_SCARMATO,
      };
      default: return null;
    }
  };
  const clickSave = () => {
    if (Number(qty) <= Number(item.trackOf.qtProduire)) {
      setLoader(true);
      console.log(item.trackOf.etat);
      let x = screenToBack(item.trackOf.etat);
      updateStateOf(userToken, {
        etat: nextEtatOf(item.trackOf.etat),
        idOf: item.trackOf.idOf,
        QtProduire: Number(qty),
        Commentaire: cmntr ? cmntr : '',
      }).then((resp) => {
        navigation.navigate('sahredOfScreen',
          {
            titreOfScreen: x.titreOfScreen,
            TypeOfScreen: x.TypeOfScreen,
          });
        setLoader(false);
      });
    } else {
      SweetAlert.showAlertWithOptions({
        title: 'Error',
        subTitle: "La quantité saisie est supérieure à la quantité de l'Of",
        confirmButtonTitle: 'OK',
        confirmButtonColor: '#000',
        otherButtonTitle: 'Cancel',
        otherButtonColor: '#dedede',
        style: 'error',
        cancellable: true,
      },
        callback => setQty(item.trackOf.qtProduire));
    }

  };
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
            {'Validation de Of'}
          </Text>
        }
      />
      <KeyboardAvoidingView behavior="height" style={styles.keyboard}>

        <ScrollView showsVerticalScrollIndicator={false}>
          {item.trackOf.etat !== 'OUT_SCARMATO_Confirmed' && item.trackOf.etat !== 'OUT_ULTRA_SON_Confirmed' &&
            <View style={styles.content}>
              {user.idRole !== 'Magasinier' && <Input
                label={'Quantité'}
                keyboardType="numeric"
                value={qty + ''}
                onChangeText={setQty}
                secondary
              />
              }
              <Input
                label={'Commentaire'}
                multiline
                value={cmntr}
                onChangeText={setCmntr}
                secondary
              />

              <Button
                title={'Enregistrer'}
                containerStyle={styles.button}
                onPress={clickSave}
                disabled={isNotValidForm}
                loading={loader}
              />
            </View>
          }
          {ListCommantairesFn()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  //  backgroundColor: '#FFF',

  },
  cardContent: {
  //  marginLeft: 10,
    marginTop: 10,
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
 // marginHorizontal: 20,
  backgroundColor: 'white',

  padding: 10,

  //borderLeftWidth: 6,
},   titre: {
  fontSize: 18,
  flex: 1,
  color: '#008080',
  fontWeight: 'bold',
},
titreSourceN: {
  fontSize: 18,
  color: '#008080',
  fontWeight: 'bold',
},
description: {
  marginTop: 5,
  fontSize: 12,
  flex: 1,
  color: colors.text,
  fontWeight: 'bold',
},
quantite: {
  fontSize: 15,
  color: colors.error,
  fontWeight: 'bold',
},
date: {
  fontSize: 14,
  color: '#696969',
},
  keyboard: {
    flex: 1,
  },
  content: {
    marginHorizontal: 20,
    marginTop: 10,

  },
  textNotification: {
    marginBottom: 10,
  },
  button: {
    marginVertical: 30,
  },
  textStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: '1%',
  },
});

export default index;
