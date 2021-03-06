/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from 'src/utils/auth-context';
import Text from 'src/components/Text';
import { colors } from 'react-native-elements';
import { getDateCustom } from 'src/utils/time';
import { getOfsByStatus } from 'src/services/of-services';
import { updateStateOf } from '../../../services/of-services';
import SweetAlert from 'react-native-sweet-alert';
import AnimatedLoader from 'react-native-animated-loader';
import CardOf from '../../../components/CardOf';
const OfsByStatus = props => {
    const { route } = props;
    const statusOf = route?.name;
    const { userToken } = React.useContext(AuthContext);
    const [ofList, setOfList] = useState([]);
    const [stateChanged, setIsStateChanged] = useState(false);
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        setVisible(false);
        let status = '';
        switch (statusOf) {
            case 'ofNormal':
                status = 'Normal';
                break;
            case 'ofUrgent':
                status = 'Urgent';
                break;
            default:
                break;
        }
        getOfsByStatus(userToken, status).then((result) => {
            setOfList(result);
            setVisible(false);
        }).catch((err) => {
            console.log(err);
        });
    }, [stateChanged]);

    const changeStateOf = (item) => {
        Alert.alert(
            "Confirmation",
            "Envoyer l'of en fil d'attente de coupe",
            [
                {
                    text: "No OK",
                    onPress: () => {
                        updateStateOf(userToken, {
                            etat: "Annuler",
                            idOf: item.idOf,
                            statusOf: "false"
                        }).then((resp) => {
                            SweetAlert.showAlertWithOptions({
                                title: '',
                                subTitle: 'enregistrement a ??t?? effectu?? avec succ??s.',
                                confirmButtonTitle: 'OK',
                                confirmButtonColor: '#000',
                                otherButtonTitle: 'Cancel',
                                otherButtonColor: '#dedede',
                                style: 'success',
                                cancellable: true
                            },
                                callback => console.log('callback'));
                            setIsStateChanged(!stateChanged)
                        })
                    },
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        updateStateOf(userToken, { etat: "CoupeReception", idOf: item.idOf, statusOf: "true" }).then((resp) => {
                            SweetAlert.showAlertWithOptions({
                                title: '',
                                subTitle: 'enregistrement a ??t?? effectu?? avec succ??s.',
                                confirmButtonTitle: 'OK',
                                confirmButtonColor: '#000',
                                otherButtonTitle: 'Cancel',
                                otherButtonColor: '#dedede',
                                style: 'success',
                                cancellable: true
                            },
                                callback => console.log('callback'));
                            setIsStateChanged(!stateChanged)
                        })

                    }
                }
            ],
            {
                cancelable: true,
            }
        );
    }
    return (
        <View style={styles.container}>
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
                    const itemList = {
                        idOf: item.trackOf.idOf,
                        no: item.trackOf.noOf,
                        sourceNo: item.ofDto.sourceNo,
                        statusOf :item.trackOf.statusOf,
                        actionneur : item.trackOf.actionneur,
                        dateActon: item.trackOf.dateAction,
                        quantity: item.trackOf.qtProduire
                    }
                    return (
                        <CardOf item={itemList} onChangeScreen={(item) => changeStateOf(item)} />
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
});
export default OfsByStatus;
