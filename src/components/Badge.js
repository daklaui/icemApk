import * as React from 'react';
import PropTypes from 'prop-types';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, ViewPropTypes, Text} from 'react-native';
import {Badge as BadgeRN} from 'react-native-elements';
import {white} from 'src/configs/colors';

function Badge(props) {
  const {colors} = useTheme();
  const {badgeStyle, textStyle, status, ...rest} = props;
  return (
    <BadgeRN
      {...rest}
      badgeStyle={StyleSheet.flatten([
        styles.badge,
        styles.colorBadge(colors?.[status] ?? colors.primary),
        badgeStyle,
      ])}
      textStyle={StyleSheet.flatten([styles.text, textStyle])}
    />
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 0,
  },
  colorBadge: color => ({
    backgroundColor: color,
  }),
  text: {
    color: white,
  },
});

Badge.propTypes = {
  badgeStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  status: PropTypes.oneOf(['primary', 'success', 'warning', 'error']),
};

Badge.defaultProps = {
  containerStyle: {},
  textStyle: {},
};

export default Badge;
