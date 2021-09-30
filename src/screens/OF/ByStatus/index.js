/* eslint-disable prettier/prettier */
import * as React from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import * as themeColors from 'src/configs/themes';
import { colors } from 'react-native-elements';
import Text from 'src/components/Text';
import Header from 'src/containers/Header';
import Icon from 'src/components/Icon';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from 'src/utils/auth-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Text as TextKitten } from '@ui-kitten/components';
import OfsByStatus from './ofByStatus';
const { Navigator, Screen } = createMaterialTopTabNavigator();
const TopTabBar = ({ navigation, state }) => (
    <TabBar
        style={{ backgroundColor: colors.background, marginTop: 10 }}
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index],{status : index})}>
        <Tab title='OF NORMAL' />
        <Tab title='OF URGENT' />
    </TabBar>
);
const TabNavigator = () => (
    <Navigator tabBar={props => <TopTabBar {...props} />}>
        <Screen name='ofNormal' component={OfsByStatus} />
        <Screen name='ofUrgent' component={OfsByStatus} />
    </Navigator>
);
const index = () => {
    const navigation = useNavigation();
    const {signOut } = React.useContext(AuthContext);
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
                        {'Ordre de fabrication'}
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
            <TabNavigator />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },

});

export default index;
