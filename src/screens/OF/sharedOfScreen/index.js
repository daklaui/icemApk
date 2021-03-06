/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthContext } from 'src/utils/auth-context';
import Text from 'src/components/Text';
import { colors } from 'react-native-elements';
import { getDateCustom } from 'src/utils/time';
import { GetHistoriqueOf, GetOfByActionneur, getOfByEtatStatus, getOfsByEtat, GetOfTracksByOfName, getSearchUsersByEtat, GetUsersByEtat, updateStatus } from '../../../services/of-services';
import Header from 'src/containers/Header';
import Icon from 'src/components/Icon';
import { TypeScreens } from '../../../configs/typeOfScreens';
import AnimatedLoader from 'react-native-animated-loader';
import RBSheet from 'react-native-raw-bottom-sheet';
import SearchBar from '@nghinv/react-native-search-bar';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getDateCustomApi } from '../../../utils/time';
import { gray5, green, StatusColors } from '../../../configs/colors';
import Toggle from 'react-native-toggle-element';
import CardOf from '../../../components/CardOf';
import { HeaderSearch } from '../../../components/HeaderSearch';
import Calander from '../../../components/Calander';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from 'src/components/Button';
const Index = props => {
    const { route } = props;
    const navigation = useNavigation();
    const titreOfScreen = route?.params.titreOfScreen;
    const TypeOfScreen = route?.params.TypeOfScreen;
    const { userToken, user } = React.useContext(AuthContext);
    const [ofList, setOfList] = useState([]);
    const [visible, setVisible] = useState(true);
    const refRBSheet = useRef();
    const searchByDate = useRef();
    const searchByStatus = useRef();
    const searchByUser = useRef();
    const changeStateOf = useRef();
    const [open, setOpen] = useState(false);
    const [setSelectedItem, setsetSelectedItem] = useState(null)
    const [loader, setLoader] = useState(false);
    const [ListEtats, setListEtats] = useState([
        { label: 'Normal', value: 'Normal' },
        { label: 'Urgent', value: 'Urgent' },
        { label: 'Retarder', value: 'Retarder' },
        { label: 'Stopper Production', value: 'Stopper Production' },
        { label: 'Annuler', value: 'Annuler' },
        { label: 'Stopper', value: 'Stopper' },
        { label: 'Qualit??', value: 'Qualit??' }
    ]);
    const [newStatus, setNewStatus] = useState(null)
    const etatOf = () => {
        switch (TypeOfScreen) {
            case TypeScreens.Annuler: return 'Annuler';
            case TypeScreens.CoupeReception: return 'CoupeReception';
            case TypeScreens.IN_coupe: return 'IN_coupe';
            case TypeScreens.Out_coupe: return 'Out_coupe';
            case TypeScreens.IN_SCARMATO: return 'IN_SCARMATO';
            case TypeScreens.OUT_SCARMATO: return 'OUT_SCARMATO';
            case TypeScreens.OUT_SCARMATO_Confirmed: return 'OUT_SCARMATO_Confirmed';
            case TypeScreens.In_Sertissage: return 'In_Sertissage';
            case TypeScreens.Out_Sertissage: return 'Out_Sertissage';
            case TypeScreens.IN_Magasin_fils: return 'IN_Magasin_fils';
            case TypeScreens.Out_Magasin_fils: return 'Out_Magasin_fils';
            case TypeScreens.IN_Preparation: return 'IN_Preparation';
            case TypeScreens.OUT_Preparation: return 'OUT_Preparation';
            case TypeScreens.IN_UTRA_SON: return 'IN_UTRA_SON';
            case TypeScreens.OUT_ULTRA_SON: return 'OUT_ULTRA_SON';
            case TypeScreens.OUT_ULTRA_SON_Confirmed: return 'OUT_ULTRA_SON_Confirmed';
            case TypeScreens.IN_Assemblage: return 'IN_Assemblage';
            case TypeScreens.Out_Assemblage: return 'Out_Assemblage';
            default: return '';
        }
    };
    const [text, setText] = useState(null);
    const [searchUserText, setUserSearchText] = useState(null);
    const [timer, setTimer] = useState(null);
    const [users, setUsers] = useState([]);
    const [currenDate, setCurrentDate] = useState(new Date());
    const [modeOfSearch, setModeOfSearch] = useState(true);
    const timeoutRef = useRef(null);
    LocaleConfig.locales.fr = {
        monthNames: ['Janvier', 'F??vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Ao??t', 'Septembre', 'Octobre', 'Novembre', 'D??cembre'],
        monthNamesShort: ['Janv.', 'F??vr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Ao??t', 'Sept.', 'Oct.', 'Nov.', 'D??c.'],
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
        today: 'Aujourd\'hui',
    };
    LocaleConfig.defaultLocale = 'fr';



    useEffect(() => {
        let x = etatOf();
        if (text && text.length > 0) {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setVisible(true);
                timeoutRef.current = null;

                if (modeOfSearch) {
                    GetOfTracksByOfName(userToken, text, null, x, null).then((result) => {
                        setOfList(result);
                        setVisible(false);
                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    GetOfTracksByOfName(userToken, null, text, x, null).then((result) => {
                        setOfList(result);
                        setVisible(false);
                    }).catch((err) => {
                        console.log(err);
                    });
                }

            }, 500);
        }
        else {
            getOfsByEtat(userToken, x).then((result) => {
                setOfList(result);
                setVisible(false);
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [text]);

    const updateStatusOf = () => {
        setLoader(true)
        updateStatus(userToken, { IdOf: setSelectedItem.idOf, statusOf: newStatus }).then((data) => {
            changeStateOf.current.close();
            setLoader(false)
            let x = etatOf();
            setVisible(true);
            getOfsByEtat(userToken, x).then((result) => {
                setOfList(result);
                setVisible(false);
            }).catch((err) => {
                console.log(err);
            });
        }).catch((e) => { console.log(e); setLoader(false) })
    }

    useEffect(() => {
        let x = etatOf();
        if (searchUserText && searchUserText.length > 0) {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setVisible(true);
                timeoutRef.current = null;
                getSearchUsersByEtat(userToken, x, searchUserText).then((result) => {
                    setUsers(result);
                    setVisible(false);
                }).catch((err) => {
                    console.log(err);
                });
            }, 500);
        } else {
            GetUsersByEtat(userToken, x).then((result) => {
                setVisible(false);
                setUsers(result);
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [searchUserText]);
    const onChangeText = (value) => {
        setText(value);
        //    changeDelay(value.length > 0 ? value : null);
    }

    const onChangeSearchUserText = (value) => {
        setUserSearchText(value);
    }

    const serachByDay = (value) => {

        let x = etatOf();
        setVisible(true);
        GetOfTracksByOfName(userToken, null, x, getDateCustomApi(new Date(value.dateString))).then((result) => {
            setOfList(result);
            setVisible(false);
            searchByDate.current.close()
        }).catch((err) => {
            console.log(err);
        });
    }
    const searchByUserFn = (username) => {
        searchByUser.current.close()
        let x = etatOf();
        setVisible(true);
        GetOfByActionneur(userToken, x, username).then((result) => {
            setOfList(result);
            setVisible(false);
        }).catch((err) => {
            console.log(err);
        });

    }
    const searchByStatusFn = (status) => {
        searchByStatus.current.close()
        let x = etatOf();
        setVisible(true);
        getOfByEtatStatus(userToken, x, status).then((result) => {
            setOfList(result);
            setVisible(false);
        }).catch((err) => {
            console.log(err);
        });

    }

    useEffect(() => {
        let x = etatOf();
        setVisible(true);
        getOfsByEtat(userToken, x).then((result) => {
            setOfList(result);
            setVisible(false);
        }).catch((err) => {
            console.log(err);
        });
        GetUsersByEtat(userToken, x).then((result) => {
            setUsers(result);
        }).catch((err) => {
            console.log(err);
        });
        return () => {
            setOfList([]);
            setUsers([]);
        };
    }, [useIsFocused()]);

    const onChangeScreen = (item) => {
        GetHistoriqueOf(userToken, item.no).then((result) => {
            console.log(result)
            navigation.navigate('validationOf', { item: item, ListCommantaires: result })
        }).catch((err) => {
            console.log(err);
        });
    }
    const onLongPressHandled = (item) => {
        setsetSelectedItem(item)
        setNewStatus(null);
        changeStateOf.current.open();
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
                        {titreOfScreen}
                    </Text>
                }
                rightComponent={
                    <Icon
                        name="search"
                        type="FontAwesome"
                        size={30}
                        onPress={() => refRBSheet.current.open()}
                        isRotateRTL
                    />
                }

            />
            <AnimatedLoader
                visible={visible}
                overlayColor="rgba(255,255,255,0.75)"
                animationStyle={styles.lottie}
                speed={1} />
            <HeaderSearch onChangeText={(val) => onChangeText(val)} setModeOfSearch={(mode) => setModeOfSearch(mode)} />
            {!visible && <FlatList
                style={styles.tasks}
                data={ofList}
                keyExtractor={(item) => {
                    return item.id;
                }}
                renderItem={({ item }) => {
                    const itemList = {
                        idOf: item.trackOf.idOf,
                        no: item.trackOf.noOf,
                        sourceNo: item.ofDto.sourceNo,
                        statusOf: item.trackOf.statusOf,
                        actionneur: item.trackOf.actionneur,
                        dateActon: item.trackOf.dateAction,
                        quantity: item.trackOf.qtProduire,
                        etat: item.trackOf.etat,
                    }
                    return user.idRole === 'Logistique' ?
                        <CardOf item={itemList} onChangeScreen={(item) => onChangeScreen(item)} longPressHandled={(item) => onLongPressHandled(item)} /> :
                        <CardOf item={itemList} onChangeScreen={(item) => onChangeScreen(item)} />
                }} />}

            <RBSheet
                ref={refRBSheet}
                height={330}
                animationType="fade"
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {
                        backgroundColor: '#000000CC',
                    },
                    draggableIcon: {
                        backgroundColor: '#000',
                    },
                }}
            >
                <View style={styles.listContainer}>
                    <Text style={styles.listTitle}>Rechercher</Text>
                    <TouchableOpacity
                        key="account-search"
                        style={styles.listButton}
                        onPress={() => {
                            refRBSheet.current.close();
                            searchByUser.current.open();

                        }}
                    >
                        <Icon name="account-search"

                            type="material-community" style={styles.listIcon} />
                        <Text style={styles.listLabel}>Rechercher par utilisateur</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        key="calendar-search"
                        style={styles.listButton}
                        onPress={() => {
                            refRBSheet.current.close();
                            searchByDate.current.open();
                        }}
                    >
                        <Icon name="calendar-search"
                            type="material-community" style={styles.listIcon} />
                        <Text style={styles.listLabel}>Rechercher par Date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        key="text-box-search"
                        style={styles.listButton}
                        onPress={() => {
                            searchByStatus.current.open();
                            refRBSheet.current.close();
                        }}
                    >
                        <Icon name="file-search"
                            type="material-community" style={styles.listIcon} />
                        <Text style={styles.listLabel}>Rechercher par Status</Text>
                    </TouchableOpacity>

                </View>
            </RBSheet>


            <RBSheet
                ref={changeStateOf}
                height={400}
                animationType="fade"
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {
                        backgroundColor: '#000000CC',
                    },
                    draggableIcon: {
                        backgroundColor: '#000',
                    },
                }}
            >
                <View style={styles.listContainer}>
                    <Text style={styles.listTitleChangeState}>Changer l'??tat d'un of</Text>
                    <View style={{ width: "70%", display: "flex", flexDirection: "row", alignItems: "baseline" }}>
                        <DropDownPicker
                            style={{
                                borderColor: colors.border,
                                borderRadius: 4,
                                width: "90%"

                            }}
                            open={open}
                            value={newStatus}
                            items={ListEtats}
                            setItems={setListEtats}
                            setValue={setNewStatus}
                            setOpen={setOpen}
                            dropDownContainerStyle={{
                                borderColor: colors.border,
                                borderRadius: 4,
                            }}
                            placeholder="merci de choisir une status"
                        />
                        <Button
                            title={'Enregistrer'}
                            containerStyle={styles.button}
                            onPress={() => updateStatusOf()}
                            disabled={newStatus === null ? true : false}
                            loading={loader}
                        />
                    </View>


                </View>
            </RBSheet>


            {/*   ModalSearchByTExt  */}
            <Calander refCalander={searchByDate} serachByDay={(day) => serachByDay(day)} />
            {/*   searchByStatus  */}
            <RBSheet
                ref={searchByStatus}
                animationType="fade"
                height={350}
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

                <ScrollView>
                    <View style={styles.gridContainer}>
                        <TouchableOpacity
                            key={"0"}
                            onPress={() => searchByStatusFn("Normal")}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: StatusColors.Normal }]}>
                                <Text style={styles.gridLabel}>Normal</Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"1"}
                            onPress={() => searchByStatusFn("Urgent")}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: StatusColors.Urgent }]}>
                                <Text style={styles.gridLabel}>Urgent</Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"2"}
                            onPress={() => searchByStatusFn("Urgent,Partiel")}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: StatusColors.UrgentPartielle }]}>
                                <Text style={styles.gridLabel}>Urgent Partielle</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"3"}
                            onPress={() => searchByStatusFn("Normal,Partiel")}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: StatusColors.NormalPartielle }]}>
                                <Text style={styles.gridLabel}>Normal Partielle</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"4"}
                            onPress={() => searchByStatusFn("Retarder")}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: StatusColors.Retard }]}>
                                <Text style={styles.gridLabel}>Retarder </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"5"}
                            onPress={() => searchByStatusFn("Annuler")}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: StatusColors.Annuler }]}>
                                <Text style={styles.gridLabel}>Annuler </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"6"}
                            onPress={() => searchByStatusFn("StopperP")}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: StatusColors.StoppeP }]}>
                                <Text style={styles.gridLabel}>Stopper prod </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"7"}
                            onPress={() => searchByStatusFn("StopperQ")}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: StatusColors.StoppeQ }]}>
                                <Text style={styles.gridLabel}>Stopper Qual </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </RBSheet>
            {/*   searchByStatus  */}
            <RBSheet
                ref={searchByUser}
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
                <SearchBar
                    placeholder="Search"
                    containerStyle={styles.textInput}
                    cancelButton={false}
                    value={searchUserText}
                    onChangeText={(val) => onChangeSearchUserText(val)}
                // theme={theme.textInput}
                />
                <ScrollView>
                    {users && users.map((item) => (
                        <TouchableOpacity
                            key="account"
                            style={styles.listUsers}
                            onPress={() => searchByUserFn(item.userName)}
                        >
                            <Icon name="account"
                                size={50}
                                type="material-community" style={styles.listUsersIcons} />
                            <Text style={styles.listLabelUsers}>{item.userName}</Text>
                        </TouchableOpacity>


                    ))}

                </ScrollView>
            </RBSheet>
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
    gridContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 10,
        marginBottom: 20
    }, gridButtonContainer: {
        flexBasis: "30%",
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    gridButton: {
        width: 75,
        height: 75,
        padding: 10,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    gridIcon: {
        fontSize: 30,
        color: "white"
    },
    gridLabel: {
        fontSize: 14,
        paddingTop: 10,
        color: "#fff"
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
    textInput: {
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
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
        marginTop: 30,
        marginRight: 10,
    },
    listContainer: {
        // flex: 1,
        padding: 25,
    },
    listTitle: {
        padding: 10,
        fontSize: 18,
        marginTop: 10,
        marginBottom: 15,
        color: '#666',
    },
    listTitleChangeState: {
        padding: 10,
        fontSize: 18,
        marginTop: 10,
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
    button: {
        marginVertical: 30,
    },
});
export default Index;
