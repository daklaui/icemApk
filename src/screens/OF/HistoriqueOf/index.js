/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthContext } from 'src/utils/auth-context';
import Text from 'src/components/Text';
import * as themeColors from 'src/configs/themes';
import { colors } from 'react-native-elements';
import { getDateCustom } from 'src/utils/time';
import { getOfs, getOfsByEtat } from '../../../services/of-services';
import Header from 'src/containers/Header';
import Icon from 'src/components/Icon';
import { TypeScreens } from '../../../configs/typeOfScreens';
import AnimatedLoader from 'react-native-animated-loader';
import Toggle from 'react-native-toggle-element';
import SearchBar from '@nghinv/react-native-search-bar';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { gray5, green, StatusColors } from '../../../configs/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import { getDateCustomApi } from '../../../utils/time';
const Index = props => {
    const navigation = useNavigation();
    const { userToken } = React.useContext(AuthContext);
    const [ofList, setOfList] = useState([]);
    const [ofListBackup, setOfListBackup] = useState([]);
    const [timer, setTimer] = useState(null);
    const { colors } = themeColors.themeLight;
    const [visible, setVisible] = useState(true);
    const [modeOfSearch, setModeOfSearch] = useState(true);
    const [text, setText] = useState(null);
    const searchByDate =  useRef(null);
    useEffect(() => {
        //let x = etatOf();
        setVisible(true)
        getOfs(userToken).then((result) => {
            setOfList(result);
            setOfListBackup(result);
            setVisible(false)
        }).catch((err) => {
            console.log(err);
        });
        return () => {
            setOfList([]);
        };
    }, [useIsFocused()]);

    const onChangeText = (value) => {
        setText(value);
        changeDelay(value);
    }

    function changeDelay(change) {
        let valueOfCounter = change !== null && change.length > 0 ? 700 : 0;
        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
        setTimer(
            setTimeout(() => {
                setVisible(true);
                if (change && change.length > 0) {
                    if (modeOfSearch) {
                      setOfList(searchItemByOfName(change));
                    } else {
                        setOfList(searchItemByNSource(change));
                    }
                    setVisible(false);
                } else {

                    getOfs(userToken).then((result) => {
                        setOfList(result);
                        setVisible(false)
                    }).catch((err) => {
                        console.log(err);
                    });
                }


            }, valueOfCounter)
        );
    }
 
   const searchItemByOfName = (value) => ofList.filter((item) => {return item.trackOf.noOf.includes(value);});
   const searchItemByNSource = (value) => ofList.filter((item) => {return item.ofDto.sourceNo.includes(value);});
   const serachByDay = (value) =>{setOfList(ofListBackup.filter((item) => {return getDateCustomApi(item.trackOf.dateAction) === value.dateString})) ; searchByDate.current.close();}


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
                rightComponent={
                    <Icon
                        name="search"
                        type="FontAwesome"
                        size={30}
                        onPress={() => searchByDate.current.open()}
                        isRotateRTL
                    />
                }
            />
            <AnimatedLoader
                visible={visible}
                overlayColor="rgba(255,255,255,0.75)"
                animationStyle={styles.lottie}
                speed={1}/>
                <View style={styles.searchSection}>
                    <SearchBar
                        placeholder={modeOfSearch ? 'Rechercher par Nom OF' : 'Rechercher par N° source'}
                        containerStyle={styles.textInput}
                        cancelButton={false}
                        value={text}
                        onChangeText={(val) => onChangeText(val)}
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
            {!visible && <FlatList
                style={styles.tasks}
              //  columnWrapperStyle={styles.listContainer}
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

                        <TouchableOpacity style={[styles.card, { borderColor: borderColor }]} onPress={() => navigation.navigate('historqueOfDetail', { noOf: item.trackOf.noOf })}>
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
                    current={new Date()}
                    onDayPress={(day) => serachByDay(day)}
                    enableSwipeMonths={true}
                />
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
    textInput: {
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
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
    searchSection: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    searchIcon: {
        marginTop: 30,
        marginRight: 10,
    },
    date: {
        fontSize: 14,
        color: '#696969',
    },
});
export default Index;
