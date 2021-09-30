/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from 'src/utils/auth-context';
import Text from 'src/components/Text';
import * as themeColors from 'src/configs/themes';
import { colors } from 'react-native-elements';
import { getDateCustom } from 'src/utils/time';
import { getOfsByEtat, updateStateOf } from '../../../services/of-services';
import Header from 'src/containers/Header';
import Icon from 'src/components/Icon';
import { TypeScreens } from '../../../configs/typeOfScreens';
const Index = props => {
    const { route } = props;
    const navigation = useNavigation();
    const titreOfScreen = route?.params.titreOfScreen;
    const TypeOfScreen = route?.params.TypeOfScreen;
    const { userToken } = React.useContext(AuthContext);
    const [ofList, setOfList] = useState([]);
    const { colors } = themeColors.themeLight;

    const etatOf = () => {
        switch (TypeOfScreen) {
            case TypeScreens.Magasin: return 'Magasin';
            case TypeScreens.CoupeReception: return 'CoupeReception';
            case TypeScreens.IN_coupe: return 'InCoupe';
            case TypeScreens.Out_coupe: return 'OutCoupe';
            case TypeScreens.In_Sertissage: return 'InSertisage';
            case TypeScreens.Out_Sertissage: return 'OutSertisage';
            case TypeScreens.IN_Magasin_fils: return 'InMagasinFile';
            case TypeScreens.Out_Magasin_fils: return 'OutMagasinFile';
            case TypeScreens.IN_Preparation: return 'InPreparation';
            case TypeScreens.OUT_Preparation: return 'OutPreparation';
            case TypeScreens.IN_UTRA_SON: return 'InSodureUltraSon';
            case TypeScreens.OUT_ULTRA_SON: return 'OutSodureUltraSon';
            case TypeScreens.IN_Assemblage: return 'inAssemblage';
            case TypeScreens.Out_Assemblage: return 'OutAssemblage';
            default: return ''
        }
    };
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
    useEffect(() => {
        console.log(TypeOfScreen)
        let x = etatOf();
        getOfsByEtat(userToken, x).then((result) => {
            setOfList(result);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const changeStateOf = (item) => {
        updateStateOf(userToken, { etat: nextEtatOf(item.trackOf.etat), idOf: item.trackOf.idOf }).then((resp) => {
            console.log(resp);
        });
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
                        {titreOfScreen}
                    </Text>
                }
            />
            <FlatList
                style={styles.tasks}
                columnWrapperStyle={styles.listContainer}
                data={ofList}
                keyExtractor={(item) => {
                    return item.id;
                }}
                renderItem={({ item }) => {
                    let borderColor = item.trackOf.statusOf === 'Urgent' ? '#FF4500' : null;
                    return (

                        <TouchableOpacity style={[styles.card, { borderColor: borderColor }]} onPress={() => navigation.navigate('validationOf', { item: item })}>
                            <View style={styles.cardContent}>
                                {/*<Text style={[styles.description, getDescriptionStyle(item)]}>{item.description}</Text>*/}
                                <Text style={[styles.titre]}>{item.trackOf.noOf}</Text>
                                <Text style={[styles.description]}>{'actionneur : ' + item.trackOf.actionneur}</Text>
                                <View style={{
                                    flex: 1,
                                    alignItems: 'center', // ignore this - we'll come back to it
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    marginTop: 6,
                                }}>
                                    <Text style={styles.date}>{getDateCustom(item.trackOf.dateAction)}</Text>
                                    <Text style={styles.quantite}>{'Quantité : ' + item.trackOf.qtProduire}</Text>

                                </View>
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
    }, tasks: {
        flex: 1,
    },
    cardContent: {
        marginLeft: 10,
        marginTop: 10,
    },
    image: {
        width: 25,
        height: 25,
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

        borderLeftWidth: 6,
    },

    titre: {
        fontSize: 18,
        flex: 1,
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
});
export default Index;
