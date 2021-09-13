import * as React from 'react';
import PropTypes from 'prop-types';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, ViewPropTypes} from 'react-native';
import Text from 'src/components/Text';
import Icon from 'src/components/Icon';
import {shadowBottom} from 'src/utils/shadow';

function SelectType(props) {
  const {colors} = useTheme();
  const {lists, valueSelect, onSelect, containerStyle} = props;
  return lists.map((list, index) => (
    <TouchableOpacity
      key={index}
      activeOpacity={0.85}
      style={[
        styles.container,
        index !== lists.length - 1 && shadowBottom,
        containerStyle,
      ]}
      onPress={() => onSelect(list)}>
      <Text
        h4
        medium
        h4Style={[
          styles.text,
          list.status === valueSelect && {color: colors.primary},
        ]}>
        {list.name}
      </Text>
      {list.status === valueSelect ? (
        <Icon name="check" color={colors.primary} />
      ) : null}
    </TouchableOpacity>
  ));
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
});

SelectType.propTypes = {
  lists: PropTypes.array,
  valueSelect: PropTypes.string,
  onSelect: PropTypes.func,
  containerStyle: ViewPropTypes.style,
};
SelectType.defaultProps = {
  lists: [],
  onSelect: () => {},
  containerStyle: {},
};

export default SelectType;
