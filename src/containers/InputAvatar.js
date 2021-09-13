import * as React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, ViewPropTypes} from 'react-native';
import {Avatar} from 'react-native-elements';
import Text from 'src/components/Text';
import Icon from 'src/components/Icon';
import Card from 'src/components/Card';
import {gray2} from 'src/configs/colors';

function InputAvatar(props) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {value, onChangeImage, containerStyle} = props;
  const propsAvatar = value
    ? {
        source: {uri: value},
      }
    : {};
  return (
    <Card third secondary={false} style={[styles.container, containerStyle]}>
      <Avatar
        {...propsAvatar}
        size={60}
        rounded
        icon={{
          name: 'account-circle',
          type: 'material-community',
          size: 30,
          color: colors.secondaryText,
        }}
        overlayContainerStyle={styles.avatar}
      />
      <TouchableOpacity style={styles.viewChange}>
        <Icon name="tooltip-image" size={20}/>
        <Text medium style={styles.textChange}>
          {t('common:text_change_avatar')}
        </Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: gray2,
  },
  viewChange: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textChange: {
    marginLeft: 6,
  },
});

InputAvatar.propTypes = {
  value: PropTypes.string,
  onChangeImage: PropTypes.func,
  containerStyle: ViewPropTypes.style,
};
InputAvatar.defaultProps = {
  containerStyle: {},
};

export default InputAvatar;
