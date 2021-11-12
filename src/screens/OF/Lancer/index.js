/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import Header from 'src/containers/Header';
import Icon from 'src/components/Icon';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from 'src/utils/auth-context';
import Text from 'src/components/Text';
import * as themeColors from 'src/configs/themes';
import { getAllOfs } from 'src/services/of-services';
import Button from 'src/components/Button';
import { addNewOfATracker, FilterOfs, addNewOfATrackerList } from '../../../services/of-services';
import SweetAlert from 'react-native-sweet-alert';
import AnimatedLoader from 'react-native-animated-loader';
import { black, red } from '../../../configs/colors';
import { getDateCustomApi } from '../../../utils/time';
import { ActivityIndicator } from 'react-native';
import { colors } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import { HeaderSearch } from '../../../components/HeaderSearch';
import CardOf from '../../../components/CardOf';
import Calander from '../../../components/Calander';
const Index = (props) => {
    const { route } = props;
    const [visible, setVisible] = useState(true);
    const [loadingMore] = useState(false);
    const navigation = useNavigation();
    const { userToken } = React.useContext(AuthContext);
    const [ofList, setOfList] = useState([]);
    const [modeOfSearch, setModeOfSearch] = useState(true);
    const [searchText, setSearchText] = useState('');
    const { colors } = themeColors.themeLight;
    const [selectedItems, setSelectedItems] = useState([]);
    const typeOfSearch = useRef(null);
    const timeoutRef = useRef(null);
    useEffect(() => {
        getAllOfs(userToken).then((result) => {
            //   console.log(result);
            setOfList(result);
            setVisible(false);
        }).catch((err) => {
            console.log(err);
        });

    }, []);

    useEffect(() => {
        if (searchText.length > 0) {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setVisible(true);
                timeoutRef.current = null;
                if (searchText.length > 0) {
                    if (modeOfSearch) {
                        getOfsBySearchText(searchText + '', null);
                    } else {
                        getOfsBySearchText(null, searchText + '');
                    }
                }
                else {
                    getAllOfs(userToken).then((result) => {
                        setOfList(result);
                        setVisible(false);
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }, 500);
        }else
        {
            setVisible(true);
            getAllOfs(userToken).then((result) => {
                setOfList(result);
                setVisible(false);
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [searchText]);


    const RenderItem = ({ item }) => {
        const itemList = {
            no: item.no,
            sourceNo: item.sourceNo,
            description: item.description,
            dateActon: item.date_creation_of,
            quantity: item.quantity
        }
        return (
            <Swipeout key={`of${item.no}`} style={{ backgroundColor: colors.background }} right={swipeoutBtns(item)}>
                <CardOf item={itemList} onChangeScreen={(item) => clickEventListener(item)} selectedItem={(no) => isItemSelected(no)} longPressHandled={(item) => onLongPressHandel(item)} />
            </Swipeout>

        );

    }
    const clickEventListener = (item) => {
        if (selectedItems.length > 0) {
            return onLongPressHandel(item);
        }
        Alert.alert(item.description);
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
        //  displayResult(value);
    };

    const getOfsBySearchText = (name, noSource, date) => {
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

    const addSelectedItems = (type) => {
        let sendArry = [];
        ofList.forEach((item) => {
            if (selectedItems.includes(item.no)) {
                sendArry.push({ QtProduire: item.quantity, NoOf: item.no, statusOf: type, etat: 'enAttenteDePlanification' });
            }
        });
        addNewOfATrackerList(userToken, sendArry).then((result) => {
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
            setSelectedItems([]);
        }).catch((err) => {
            console.log(err);
        });
    };

    const serachByDay = (value) => {
        setVisible(true);
        getOfsBySearchText(null, null, getDateCustomApi(new Date(value.dateString)));
    };
    const onLongPressHandel = (item) => {
        if (selectedItems.includes(item.no)) {
            const newList = selectedItems.filter((no) => no !== item.no);
            console.log(newList);
            return setSelectedItems([...newList]);
        }
        setSelectedItems([...selectedItems, item.no]);
    };
    const isItemSelected = (ofNum) => {
        return selectedItems.includes(ofNum);
    };
    const selectAll = () => {
        let arr = [];
        ofList.map((item) => arr.push(item.no));
        setSelectedItems(arr);
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

            <HeaderSearch onChangeText={(val) => onChangeSearchText(val)} setModeOfSearch={(mode) => setModeOfSearch(mode)} />

            {selectedItems.length > 0 && <View style={styles.buttonSection}>
                <Button
                    onPress={() => addSelectedItems('Urgent')}
                    title="Urgent"
                    buttonStyle={{ backgroundColor: red }}
                />
                <Button
                    onPress={() => addSelectedItems('Normal')}
                    buttonStyle={{ backgroundColor: black }}
                    title="Normal"
                />
                <Button
                    onPress={() => selectAll()}
                    title="Select all"
                />
                <Button
                    onPress={() => { setSelectedItems([]); }}
                    title="Deselect All"
                />
            </View>
            }
            {
                !visible && <FlatList
                    style={styles.tasks}
                    data={ofList}
                    keyExtractor={(item) => {
                        return item.id;
                    }}
                    initialNumToRender={10}
                    renderItem={(item) => RenderItem(item)}
                    ListFooterComponent={() => loadingMore && <View style={{ margin: '10%' }}><ActivityIndicator /></View>}
                />
            }
            <Calander refCalander={typeOfSearch} serachByDay={(day) => serachByDay(day)} />
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
        padding: 10,
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
        overflow: 'hidden',
        borderRadius: 5,
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
    buttonSection: {
        marginVertical: '5%',
        paddingHorizontal: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        left: 0,
        top: 0,
    },
});
export default Index;
