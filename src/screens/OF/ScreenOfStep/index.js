/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import Text from 'src/components/Text';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import Header from 'src/containers/Header';
import Icon from 'src/components/Icon';
import ToggleSwitch from 'toggle-switch-react-native';
import { updateStateOf } from '../../../services/of-services';
import { AuthContext } from 'src/utils/auth-context';
import { TitreOfScreens, TypeScreens } from '../../../configs/typeOfScreens';
import SweetAlert from 'react-native-sweet-alert';
const index = (props) => {
  const { navigation, route } = props;
  const { userToken } = React.useContext(AuthContext);
  const item = route?.params?.item ?? null;
  const [isOn, setIsOn] = useState(true);
  const [loader, setLoader] = useState(false);
  const [qty, setQty] = useState('');
  const [cmntr, setCmntr] = useState('');
  useEffect(() => {
    console.log(item)
    setQty(item.trackOf.qtProduire);
  }, []);

  const nextEtatOf = (etat) => {
    switch (etat) {
      case TypeScreens.Magasin: return 'CoupeReception';
      case TypeScreens.CoupeReception: return 'IN_coupe';
      case TypeScreens.IN_coupe: return 'Out_coupe';
      case TypeScreens.Out_coupe: return 'In_Sertissage';
      case TypeScreens.In_Sertissage: return 'Out_Sertissage';
      case TypeScreens.Out_Sertissage: return 'IN_Magasin_fils';
      case TypeScreens.IN_Magasin_fils: return 'Out_Magasin_fils';
      case TypeScreens.Out_Magasin_fils: return 'IN_Preparation';
      case TypeScreens.IN_Preparation: return 'OUT_Preparation';
      case TypeScreens.OUT_Preparation: return 'IN_UTRA_SON';
      case TypeScreens.IN_UTRA_SON: return 'OUT_ULTRA_SON';
      case TypeScreens.OUT_ULTRA_SON: return 'IN_Assemblage';
      case TypeScreens.IN_Assemblage: return 'Out_Assemblage';
      case TypeScreens.Out_Assemblage: return 'produitFini';
      default: return '';
    }
  };

  const screenToBack = (etat) => {
    switch (etat) {
      case TypeScreens.Magasin: return {
        titreOfScreen: TitreOfScreens.ScreenMagasin,
        TypeOfScreen: TypeScreens.Magasin,
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
      case TypeScreens.IN_Assemblage: return {
        titreOfScreen: TitreOfScreens.ScreenIN_Assemblage,
        TypeOfScreen: TypeScreens.IN_Assemblage,
      };
      case TypeScreens.Out_Assemblage: return {
        titreOfScreen: TitreOfScreens.ScreenOut_Assemblage,
        TypeOfScreen: TypeScreens.Out_Assemblage,
      };
      default: return null;
    }
  };
  const clickSave = () => {
    if (Number(qty) <= Number(item.trackOf.qtProduire)) {
      setLoader(true);
      let x = screenToBack(item.trackOf.etat);
      updateStateOf(userToken, {
        etat: nextEtatOf(item.trackOf.etat),
        idOf: item.trackOf.idOf,
        statusOf: (isOn).toString(),
        QtProduire: Number(qty),
        Commentaire: cmntr ? cmntr : ''
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
        cancellable: true
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
          <View style={styles.content}>
            <Input
              label={'Quantité'}
              keyboardType="numeric"
              value={qty + ''}
              onChangeText={setQty}
              secondary
            />
            <Input
              label={'Commentaire'}
              multiline
              value={cmntr}
              onChangeText={setCmntr}
              secondary
            />
            {item.trackOf.etat === 'Magasin' && <ToggleSwitch
              isOn={isOn}
              onColor="green"
              offColor="red"
              label="OF OK ?"
              labelStyle={{ color: 'black', fontWeight: '900' }}
              size="large"
              onToggle={isOn => setIsOn(isOn)}
            />}
            <Button
              title={'Enregistrer'}
              containerStyle={styles.button}
              onPress={clickSave}
              // disabled = {isNotValidForm}
              loading={loader}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',

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
});

export default index;
