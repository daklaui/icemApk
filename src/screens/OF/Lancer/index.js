/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import Header from 'src/containers/Header';
import Icon from 'src/components/Icon';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from 'src/utils/auth-context';
import Text from 'src/components/Text';
import Swipeout from 'react-native-swipeout';
import * as themeColors from 'src/configs/themes';
import { getAllOfs } from 'src/services/of-services';
import { colors } from 'react-native-elements';
import { getDateCustom } from 'src/utils/time';
import { addNewOfATracker } from '../../../services/of-services';
import SweetAlert from 'react-native-sweet-alert';
import AnimatedLoader from 'react-native-animated-loader';
const index = () => {
    const [visible, setVisible] = useState(true);
    const navigation = useNavigation();
    const { user, signOut, userToken } = React.useContext(AuthContext);
    const [ofList, setOfList] = useState([]);
    const { colors } = themeColors.themeLight;
    useEffect(() => {
        getAllOfs(userToken).then((result) => {
            //   console.log(result);
            setOfList(result);
            setVisible(false)
        }).catch((err) => {
            console.log(err);
        });

    }, []);
    const clickEventListener = (item) => {
        Alert.alert(item.description);
    };

    const getCompletedIcon = (item) => {
        return 'https://img.icons8.com/flat_round/64/000000/checkmark.png';
        /*  if (item.completed == 1) {
            return 'https://img.icons8.com/flat_round/64/000000/checkmark.png';
          } else {
            return 'https://img.icons8.com/flat_round/64/000000/delete-sign.png';
          }*/
    };

    const getDescriptionStyle = (item) => {
        if (item.completed == 1) {
            return { textDecorationLine: 'line-through', fontStyle: 'italic', color: '#808080' };
        }
    };
    const addOf = (of) => {
        addNewOfATracker(userToken, of).then((result) => {
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
            setOfList([])
            setOfList(result)
        }).catch((e) => {
            console.log(e)
        });
    };
    const swipeoutBtns = (item) => {
        return [
            {
                text: 'Urgent',
                autoClose: true,
                backgroundColor: colors.gray,
                type: 'delete',
                onPress: () => {
                    addOf({ QtProduire: item.quantity, NoOf: item.no, statusOf: 'Urgent', etat: 'enAttenteDePlanification' });
                },

            },
            {
                text: 'Normal',
                autoClose: true,
                backgroundColor: colors.secondaryText,
                type: 'default',
                onPress: () => {
                    addOf({ QtProduire: item.quantity, NoOf: item.no, statusOf: 'Normal', etat: 'enAttenteDePlanification' });

                },
            },
        ];
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
                        {'Of Lancer'}
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
                    return (
                        <Swipeout style={{ backgroundColor: colors.background }} right={swipeoutBtns(item)}>
                            <TouchableOpacity style={[styles.card, { borderColor: item.color }]} onPress={() => { clickEventListener(item); }}>
                                <View style={styles.cardContent}>
                                    {/*<Text style={[styles.description, getDescriptionStyle(item)]}>{item.description}</Text>*/}
                                    <Text style={[styles.titre]}>{item.no}</Text>
                                    <Text style={[styles.description]}>{item.description}</Text>
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'center', // ignore this - we'll come back to it
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        marginTop: 6,
                                    }}>
                                        <Text style={styles.date}>{getDateCustom(item.date_creation_of)}</Text>
                                        <Text style={styles.quantite}>{'Quantité : ' + item.quantity}</Text>

                                    </View>

                                </View>
                            </TouchableOpacity>
                        </Swipeout>
                    );
                }} />}

        </View>
    );
};
const styles = StyleSheet.create({
    lottie: {
        width: 100,
        height: 100,
    },
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
export default index;
