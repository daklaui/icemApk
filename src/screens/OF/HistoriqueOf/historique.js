/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthContext } from 'src/utils/auth-context';
import Text from 'src/components/Text';
import * as themeColors from 'src/configs/themes';
import { colors } from 'react-native-elements';
import { getDateCustom } from 'src/utils/time';
import { GetHistoriqueOf, getOfs, getOfsByEtat } from '../../../services/of-services';
import Header from 'src/containers/Header';
import Icon from 'src/components/Icon';
import { TypeScreens } from '../../../configs/typeOfScreens';
import AnimatedLoader from 'react-native-animated-loader';
import { StatusColors } from '../../../configs/colors';
const historique = props => {
    const navigation = useNavigation();
    const { route } = props;
    const noOf = route?.params.noOf;
    const { userToken } = React.useContext(AuthContext);
    const [ofList, setOfList] = useState([]);
    const { colors } = themeColors.themeLight;
    const [visible, setVisible] = useState(true);


    useEffect(() => {
        //let x = etatOf();
        setVisible(true)
        GetHistoriqueOf(userToken,noOf).then((result) => {
            setOfList(result);
            setVisible(false)
        }).catch((err) => {
            console.log(err);
        });
        return () => {
            setOfList([]);
        };
    }, [useIsFocused()]);

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
                        Historique Of 
                    </Text>
                }
            />
            <AnimatedLoader
                visible={visible}
                overlayColor="rgba(255,255,255,0.75)"
                animationStyle={styles.lottie}
                speed={1}>
            </AnimatedLoader>
            {!visible && <FlatList
                style={styles.tasks}
                columnWrapperStyle={styles.listContainer}
                data={ofList}
                keyExtractor={(item) => {
                    return item.id;
                }}
                renderItem={({ item }) => {
                    let borderColor;//= item.trackOf.statusOf.includes('Urgent') ? '#FF4500' : null;
                    switch (item.trackOf.statusOf) {
                        case 'Urgent': borderColor = StatusColors.Urgent; break;
                        case 'Urgent,Partiel': borderColor = StatusColors.UrgentPartielle; break;
                        case 'Normal,Partiel': borderColor = StatusColors.NormalPartielle; break;
                        case 'Retard': borderColor = StatusColors.Retard; break;
                        case 'StoppeP': borderColor = StatusColors.StoppeP; break;
                        case 'StoppeQ': borderColor = StatusColors.StoppeQ; break;
                        case 'Annulé': borderColor = StatusColors.Annuler; break;
                        default: borderColor = StatusColors.Normal; break;
                    }


                    return (

                        <TouchableOpacity style={[styles.card, { borderColor: borderColor }]}>
                            <View style={styles.cardContent}>
                                {/*<Text style={[styles.description, getDescriptionStyle(item)]}>{item.description}</Text>*/}
                                <Text style={[styles.titre]}>{item.trackOf.noOf}({item.trackOf.etat})</Text>
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
                }} />}
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
export default historique;
