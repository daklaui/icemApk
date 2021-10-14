/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthContext } from 'src/utils/auth-context';
import Text from 'src/components/Text';
import * as themeColors from 'src/configs/themes';
import { colors } from 'react-native-elements';
import { getDateCustom } from 'src/utils/time';
import { getOfsByEtat, GetOfTracksByOfName } from '../../../services/of-services';
import Header from 'src/containers/Header';
import Icon from 'src/components/Icon';
import { TypeScreens } from '../../../configs/typeOfScreens';
import AnimatedLoader from 'react-native-animated-loader';
import RBSheet from 'react-native-raw-bottom-sheet';
import SearchBar from '@nghinv/react-native-search-bar';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getDateCustomApi } from '../../../utils/time';
const Index = props => {
    const { route } = props;
    const navigation = useNavigation();
    const titreOfScreen = route?.params.titreOfScreen;
    const TypeOfScreen = route?.params.TypeOfScreen;
    const { userToken } = React.useContext(AuthContext);
    const [ofList, setOfList] = useState([]);
    const { colors } = themeColors.themeLight;
    const [visible, setVisible] = useState(true);
    const refRBSheet = useRef();
    const searchByDate = useRef();
    const searchByStatus = useRef();
    const searchByUser = useRef();
    const etatOf = () => {
        switch (TypeOfScreen) {
            case TypeScreens.Magasin: return 'Magasin';
            case TypeScreens.CoupeReception: return 'CoupeReception';
            case TypeScreens.IN_coupe: return 'IN_coupe';
            case TypeScreens.Out_coupe: return 'Out_coupe';
            case TypeScreens.In_Sertissage: return 'In_Sertissage';
            case TypeScreens.Out_Sertissage: return 'Out_Sertissage';
            case TypeScreens.IN_Magasin_fils: return 'IN_Magasin_fils';
            case TypeScreens.Out_Magasin_fils: return 'Out_Magasin_fils';
            case TypeScreens.IN_Preparation: return 'IN_Preparation';
            case TypeScreens.OUT_Preparation: return 'OUT_Preparation';
            case TypeScreens.IN_UTRA_SON: return 'IN_UTRA_SON';
            case TypeScreens.OUT_ULTRA_SON: return 'OUT_ULTRA_SON';
            case TypeScreens.IN_Assemblage: return 'IN_Assemblage';
            case TypeScreens.Out_Assemblage: return 'Out_Assemblage';
            default: return '';
        }
    };
    const [text, setText] = useState(null);
    const [timer, setTimer] = useState(null);
    const [currenDate, setCurrentDate] = useState(new Date());

    LocaleConfig.locales.fr = {
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
        today: 'Aujourd\'hui',
    };
    LocaleConfig.defaultLocale = 'fr';
    const onChangeText = (value) => {
        setText(value);
        changeDelay(value.length > 0 ? value : null);
    }

    function changeDelay(change) {
        let valueOfCounter = change !== null && change.length > 0 ? 700 : 0;
        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
        setTimer(
            setTimeout(() => {
                let x = etatOf();
                setVisible(true);
                GetOfTracksByOfName(userToken, change, x, null).then((result) => {
                    setOfList(result);
                    setVisible(false);
                }).catch((err) => {
                    console.log(err);
                });
            }, valueOfCounter)
        );
    }

    const serachByDay = (value) => {

        let x = etatOf();
        setVisible(true);
        GetOfTracksByOfName(userToken, null, x, getDateCustomApi(new Date(value.dateString))).then((result) => {
            console.log(result)
            setOfList(result);
            setVisible(false);
            searchByDate.current.close()
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
            <SearchBar
                placeholder="Rechercher par N° Of"
                containerStyle={styles.textInput}
                cancelButton={false}
                value={text}
                onChangeText={(val) => onChangeText(val)}
            // theme={theme.textInput}
            />
            {!visible && <FlatList
                style={styles.tasks}
                // columnWrapperStyle={styles.listContainer}
                data={ofList}
                keyExtractor={(item) => {
                    return item.id;
                }}
                renderItem={({ item }) => {
                    let borderColor;//= item.trackOf.statusOf.includes('Urgent') ? '#FF4500' : null;
                    switch (item.trackOf.statusOf) {
                        case 'Urgent': borderColor = '#FF4500'; break;
                        case 'Urgent,Partiel': borderColor = '#FFCC00'; break;
                        case 'Normal,Partiel': borderColor = '#FF9966'; break;
                        default: borderColor = null; break;
                    }


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

            {/*   ModalSearchByTExt  */}
            <RBSheet
                ref={searchByDate}
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
                            onPress={() => console.log()}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: "#000000" }]}>
                                <Text style={styles.gridLabel}>Normal</Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"1"}
                            onPress={() => console.log()}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: "#9C1C6B" }]}>
                                <Text style={styles.gridLabel}>Urgent</Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"2"}
                            onPress={() => console.log()}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: "#CA278C" }]}>
                                <Text style={styles.gridLabel}>Urgent Partielle</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"3"}
                            onPress={() => console.log()}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: "#ff9966" }]}>
                                <Text style={styles.gridLabel}>Normal Partielle</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"4"}
                            onPress={() => console.log()}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: "#E47297" }]}>
                                <Text style={styles.gridLabel}>Retarder </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"5"}
                            onPress={() => console.log()}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: "#cc3300" }]}>
                                <Text style={styles.gridLabel}>Annuler </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"6"}
                            onPress={() => console.log()}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: "#AA0114" }]}>
                                <Text style={styles.gridLabel}>Stopper prod </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={"7"}
                            onPress={() => console.log()}
                            style={styles.gridButtonContainer}
                        >
                            <View style={[styles.gridButton, { backgroundColor: "#f7514b" }]}>
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
                    value={text}
                    onChangeText={() => console.log("")}
                // theme={theme.textInput}
                />
                <ScrollView>
                    <TouchableOpacity
                        key="account"
                        style={styles.listUsers}
                        onPress={() => {

                        }}
                    >
                        <Icon name="account"
                            size={50}
                            type="material-community" style={styles.listUsersIcons} />
                        <Text style={styles.listLabelUsers}>Dakhloaui moataz</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        key="account"
                        style={styles.listUsers}
                        onPress={() => {

                        }}
                    >
                        <Icon name="account"
                            size={50}
                            type="material-community" style={styles.listUsersIcons} />
                        <Text style={styles.listLabelUsers}>Dakhloaui moataz</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        key="account"
                        style={styles.listUsers}
                        onPress={() => {

                        }}
                    >
                        <Icon name="account"
                            size={50}
                            type="material-community" style={styles.listUsersIcons} />
                        <Text style={styles.listLabelUsers}>Dakhloaui moataz</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        key="account"
                        style={styles.listUsers}
                        onPress={() => {

                        }}
                    >
                        <Icon name="account"
                            size={50}
                            type="material-community" style={styles.listUsersIcons} />
                        <Text style={styles.listLabelUsers}>Dakhloaui moataz</Text>
                    </TouchableOpacity>
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
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    date: {
        fontSize: 14,
        color: '#696969',
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
export default Index;
