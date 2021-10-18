/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from 'src/utils/auth-context';
import Text from 'src/components/Text';
import * as themeColors from 'src/configs/themes';
import { colors } from 'react-native-elements';
import { getDateCustom } from 'src/utils/time';
import { getOfsByStatus } from 'src/services/of-services';
import { updateStateOf } from '../../../services/of-services';
import SweetAlert from 'react-native-sweet-alert';
import AnimatedLoader from 'react-native-animated-loader';
const OfsByStatus = props => {
    const { route } = props;
    const navigation = useNavigation();
    const statusOf = route?.name;
    const { userToken } = React.useContext(AuthContext);
    const [ofList, setOfList] = useState([]);
    const [stateChanged, setIsStateChanged] = useState(false);
    const { colors } = themeColors.themeLight;
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
    const getCompletedIcon = (item) => {
        return 'https://img.icons8.com/flat_round/64/000000/checkmark.png';
        /*  if (item.completed == 1) {
            return 'https://img.icons8.com/flat_round/64/000000/checkmark.png';
          } else {
            return 'https://img.icons8.com/flat_round/64/000000/delete-sign.png';
          }*/
    };

    /*  const getDescriptionStyle = (item) => {
          if (item.completed == 1) {
              return { textDecorationLine: 'line-through', fontStyle: 'italic', color: '#808080' };
          }
      };*/
    const changeStateOf = (item) => {
        Alert.alert(

            "Confirmation",
            "Envoyer l'of en fil d'attente de coupe",
            [
                {
                    text: "No OK",
                    onPress: () => {
                        console.log('test')
                        updateStateOf(userToken, {
                            etat: "Magasin",
                            idOf: item.trackOf.idOf,
                            statusOf: "false"
                        }).then((resp) => {
                            console.log(resp)
                            SweetAlert.showAlertWithOptions({
                                title: '',
                                subTitle: 'enregistrement a été effectué avec succès.',
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
                        updateStateOf(userToken, { etat: "Magasin", idOf: item.trackOf.idOf, statusOf: "true" }).then((resp) => {
                            SweetAlert.showAlertWithOptions({
                                title: '',
                                subTitle: 'enregistrement a été effectué avec succès.',
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
                    let borderColor = item.trackOf.statusOf === 'Urgent' ? '#FF4500' : null;
                    return (

                        <TouchableOpacity style={[styles.card, { borderColor: borderColor }]} onPress={() => changeStateOf(item)}>
                            <View style={styles.cardContent}>
                                {/*<Text style={[styles.description, getDescriptionStyle(item)]}>{item.description}</Text>*/}
                                <View style={{
                                            flex: 1,
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                        }}>
                                            <Text style={[styles.titre]}>{item.trackOf.noOf}</Text>
                                            <Text style={[styles.titreSourceN]}>{item.ofDto.sourceNo}</Text>
                                        </View>
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
