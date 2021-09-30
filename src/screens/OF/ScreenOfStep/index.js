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
import { TypeScreens } from '../../../configs/typeOfScreens';
const index = (props) => {
  const { navigation, route } = props;
  const { userToken } = React.useContext(AuthContext);
  const item = route?.params?.item ?? null;
  const [isOn, setIsOn] = useState(false);
  const [loader, setLoader] = useState(false);
  const [qty, setQty] = useState("");
  const [cmntr, setCmntr] = useState("");
  useEffect(() => {
    console.log(item.trackOf.etat)
    setQty(item.ofDto.quantity)
  }, [])
  const nextEtatOf = (etat) => {
    switch (etat) {
        case TypeScreens.Magasin: return 'CoupeReception';
        case TypeScreens.CoupeReception: return 'InCoupe';
        case TypeScreens.IN_coupe: return 'OutCoupe';
        case TypeScreens.Out_coupe: return 'InSertisage';
        case TypeScreens.In_Sertissage: return 'OutSertisage';
        case TypeScreens.Out_Sertissage: return 'InMagasinFile';
        case TypeScreens.IN_Magasin_fils: return 'OutMagasinFile';
        case TypeScreens.Out_Magasin_fils: return 'InPreparation';
        case TypeScreens.IN_Preparation: return 'OutPreparation';
        case TypeScreens.OUT_Preparation: return 'InSodureUltraSon';
        case TypeScreens.IN_UTRA_SON: return 'OutSodureUltraSon';
        case TypeScreens.OUT_ULTRA_SON: return 'inAssemblage';
        case TypeScreens.IN_Assemblage: return 'OutAssemblage';
        case TypeScreens.Out_Assemblage : return 'produitFini';
        default: return ''
    }
};
  const clickSave = () => {
    setLoader(true);
    console.log("ddd",qty)
    updateStateOf(userToken, { etat: nextEtatOf(item.trackOf.etat), idOf: item.trackOf.idOf, QtProduire: Number(qty), Commentaire: cmntr ? cmntr : "" }).then((resp) => {
      console.log(resp)
      setLoader(false);
    })
  }
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
              value={qty + ""}
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
            {item.trackOf.etat === "Magasin" && <ToggleSwitch
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
