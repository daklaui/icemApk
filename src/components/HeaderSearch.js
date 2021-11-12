import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import SearchBar from '@nghinv/react-native-search-bar';
import Toggle from 'react-native-toggle-element';
import {gray5, green} from '../configs/colors';
export const HeaderSearch = ({onChangeText, setModeOfSearch}) => {
  const [searchText, setSearchText] = useState('');
  const [modeOfSearch, setModeLocalOfSearch] = useState(true);
  const onChangeSearchText = val => {
    onChangeText(val);
    setSearchText(val);
  };
  const onChangeModeOfSearch = val => {
    setModeOfSearch(val);
    setModeLocalOfSearch(val);
  };
  return (
    <View style={styles.searchSection}>
      <SearchBar
        placeholder={
          modeOfSearch ? 'Rechercher par Nom OF' : 'Rechercher par N° source'
        }
        containerStyle={styles.textInput}
        cancelButton={false}
        value={searchText}
        onChangeText={val => {onChangeSearchText(val);}}
      />
      <View style={styles.searchIcon}>
        <Toggle
          value={modeOfSearch}
          onPress={newState => onChangeModeOfSearch(newState)}
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
  );
};
const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchIcon: {
    alignSelf: 'center',
  },
  textInput: {
    width: '78%',
  },
});
