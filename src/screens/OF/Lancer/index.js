/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
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
import { addNewOfATracker, FilterOfs } from '../../../services/of-services';
import SweetAlert from 'react-native-sweet-alert';
import AnimatedLoader from 'react-native-animated-loader';
import SearchBar from '@nghinv/react-native-search-bar';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toggle from 'react-native-toggle-element';
import { gray5, green } from '../../../configs/colors';
import { Calendar } from 'react-native-calendars';
import { getDateCustomApi } from '../../../utils/time';
const index = () => {
    const [visible, setVisible] = useState(true);
    const navigation = useNavigation();
    const { user, signOut, userToken } = React.useContext(AuthContext);
    const [ofList, setOfList] = useState([]);
    const [modeOfSearch, setModeOfSearch] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [timer, setTimer] = useState(null);
    const { colors } = themeColors.themeLight;
    const [currenDate, setCurrentDate] = useState(new Date());
    const typeOfSearch = useRef(null);
    useEffect(() => {
        getAllOfs(userToken).then((result) => {
            //   console.log(result);
            setOfList(result);
            setVisible(false);
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
                cancellable: true,
            },
                callback => console.log('callback'));
            setOfList([]);
            setOfList(result);
        }).catch((e) => {
            console.log(e);
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

    const onChangeSearchText = (value) => {
        setSearchText(value);
        displayResult(value);
    };


    const getOfsBySearchText = (name, noSource, date) => {
        setVisible(true);
        FilterOfs(userToken, name, noSource, date).then((data) => {
            setOfList(data);
            setVisible(false);
            date && typeOfSearch.current.close();
        }).catch((error) => {
            setVisible(false);
            console.log(error);
            date && typeOfSearch.current.close();
        });
    };

    function displayResult(value) {
        let valueOfCounter = 1000;
        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
        setTimer(
            setTimeout(() => {
                if (value.length > 0) {
                    if (modeOfSearch) {
                        getOfsBySearchText(value + '', null);
                    } else {
                        getOfsBySearchText(null, value + '');
                    }
                }
                else {
                    setVisible(true);
                    getAllOfs(userToken).then((result) => {
                        //   console.log(result);
                        setOfList(result);
                        setVisible(false);
                    }).catch((err) => {
                        console.log(err);
                    });
                }

            }, valueOfCounter)
        );
    }
    const serachByDay = (value) => {
        setVisible(true);
        getOfsBySearchText(null, null, getDateCustomApi(new Date(value.dateString)));
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
                        {'Of Lancer'}
                    </Text>
                }
                rightComponent={
                    <Icon
                        name="calendar-search"
                        type="material-community"
                        size={30}
                        onPress={() => typeOfSearch.current.open()}
                        isRotateRTL
                    />
                }
            />
            <AnimatedLoader
                visible={visible}
                overlayColor="rgba(255,255,255,0.75)"
                animationStyle={styles.lottie}
                speed={1} />
            <View style={styles.searchSection}>
                <SearchBar
                    placeholder={modeOfSearch ? 'Rechercher par Nom OF' : 'Rechercher par N° source'}
                    containerStyle={styles.textInput}
                    cancelButton={false}
                    value={searchText}
                    onChangeText={(val) => onChangeSearchText(val)}
                // theme={theme.textInput}
                />
                <View style={styles.searchIcon}>
                    <Toggle
                        value={modeOfSearch}
                        onPress={(newState) => setModeOfSearch(newState)}
                        thumbButton={{
                            inActiveBackgroundColor: gray5,
                            activeBackgroundColor: '#fff',
                            width: 30,
                            height: 30,
                            radius: 30,
                        }}
                        trackBar={{
                            inactiveBackgroundColor: gray5,
                            activeBackgroundColor: green,
                            width: 50,
                            height: 10,
                            radius: 25,
                        }}
                    />
                </View>
            </View>

            {
                !visible && <FlatList
                    style={styles.tasks}
                    //  columnWrapperStyle={styles.listContainer}
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
                                        <View style={{
                                            flex: 1,
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                        }}>
                                            <Text style={[styles.titre]}>{item.no}</Text>
                                            <Text style={[styles.titreSourceN]}>{item.sourceNo}</Text>
                                        </View>

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
                    }} />
            }
            <RBSheet
                ref={typeOfSearch}
                animationType="fade"
                height={500}
                closeOnDragDown={true}
                closeOnPressMask={false}
                customStyles={{
                    wrapper: {
                        backgroundColor: '#000000CC',
                    },
                    draggableIcon: {
                        backgroundColor: '#000',
                    },
                }}
            >
                <Calendar
                    current={currenDate}
                    onDayPress={(day) => serachByDay(day)}
                    enableSwipeMonths={true}
                />
            </RBSheet>
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
    textInput: {
        // marginTop: 10,
        flex: 1,
        paddingRight: 10,
        marginLeft: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
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
    searchSection: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    searchIcon: {
        marginTop: 20,
        marginRight: 10,
    },
    listContainer: {
        // flex: 1,
        padding: 25,
    },
    listTitle: {
        padding: 10,
        fontSize: 22,
        marginTop: 10,
        marginBottom: 15,
        color: '#666',
    },
    listButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
    },
    listUsers: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,

    },
    listIcon: {
        fontSize: 50,
        color: '#666',
        width: 80,
    },
    listUsersIcons: {
        fontSize: 100,
        color: '#666',
        width: 100,
    },
    listLabel: {
        fontSize: 17,
    },
    listLabelUsers: {
        fontWeight: 'bold',
        fontSize: 18,
    },
});
export default index;
