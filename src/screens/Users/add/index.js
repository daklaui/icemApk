/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import Text from 'src/components/Text';
import Button from 'src/components/Button';
import Input from 'src/components/Input';
import Header from 'src/containers/Header';
import Icon from 'src/components/Icon';
import * as themeColors from 'src/configs/themes';
import DropDownPicker from 'react-native-dropdown-picker';
import { AuthContext } from 'src/utils/auth-context';
import { fonts, sizes } from 'src/configs/fonts';
import { AddUser } from 'src/services/users-service';
import { UpdateUser } from 'src/services/users-service';
import { useNavigation } from '@react-navigation/core';
import { getUserById } from '../../../services/users-service';
const initNotification = {
    message: null,
    type: 'error',
  };
const Index = (props) => {
    const { colors } = themeColors.themeLight;
    const { navigation, route } = props;
    const navigationC = useNavigation();
    const data = route?.params?.edit ?? null;
    const idUser = route?.params?.id ?? null;
    
    const { signOut, userToken, updateUser, user } = React.useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [idRole, setValue] = useState(null);
    const [userName, setuserName] = useState(null);
    const [password, setPassword] = useState(null);
    const [loader, setLoader] = useState(false);
    const [isNotValidForm, setIsNotValidForm] = useState(true);
    const [notification, setNotification] = React.useState(initNotification);
    const [items, setItems] = useState([
        { label: 'Administarteur', value: '1' },
        { label: 'Logistique', value: '2' },
        { label: 'Planificateur', value: '3' },
        { label: 'Magasinier', value: '4' },
        { label: 'Coupe_Sertissage', value: '5' },
        { label: 'Magasin fil', value: '6' },
        { label: 'Preparation', value: '7' },
        { label: 'Assemblage', value: '8' },
        { label: 'Direction', value: '9' },
        { label: 'Qualite', value: '10' },
        { label: 'Achat', value: '11' },
        { label: 'Bureau Etude', value: '12' },
    ]);
    const clickSave = () => {
        setLoader(true);
        if (data) {
            UpdateUser(userToken, { userName, password, idRole: Number(idRole), idUser: idUser }).then((d) => {
                if (d.message && d.message === 'Unauthorized') {
                    signOut();
                }
                else {
                    navigationC.navigate('ListUsers');
                }
            });
        } else {
            AddUser(userToken, { userName, password, idRole: Number(idRole) }).then((d) => {
                if (d.message && d.message === 'Unauthorized') {
                    signOut();
                }
                else {
                    navigationC.navigate('ListUsers');
                }
            });
        }

    };

    React.useEffect(() => {
        setLoader(false)
        if (data) {
            getUserById(userToken, idUser).then((d)=>{
                setValue(d.idRole.toString());
                setuserName(d.userName);
                setPassword(d.password);
            })
        }
    }, []);

    React.useEffect(() => {
        if (userName && userName.length > 0 && password && password.length > 0 && idRole !== null){
            setIsNotValidForm(false);
        } else {
            setIsNotValidForm(true);
        }

      }, [userName, password,idRole]);
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
                        {!data ? 'Ajouter Utlisateur' : 'Modifier Utlisateur'}
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
            <KeyboardAvoidingView behavior="height" style={styles.keyboard}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <Input
                            label={'username'}
                            value={userName}
                            onChangeText={setuserName}
                            secondary
                        />
                        <Input
                            label={'password'}
                            value={password}
                            onChangeText={setPassword}
                            secondary
                        />
                        <DropDownPicker
                            style={{ borderColor: colors.border, borderRadius: 4, marginTop: 5, minHeight: 46 }}
                            open={open}
                            value={idRole}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            dropDownContainerStyle={{
                                borderColor: colors.border,
                                borderRadius: 4,
                            }}
                            placeholder="select an user role"
                        />
                        <Button
                            title={!data ? 'Enregistrer' : 'Modifier'}
                            containerStyle={styles.button}
                            onPress={clickSave}
                            disabled = {isNotValidForm}
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
        marginTop: 20,
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

export default Index;
