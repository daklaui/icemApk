import * as React from 'react';
import PropTypes from 'prop-types';
import {useTheme} from '@react-navigation/native';
import {View, ViewPropTypes} from 'react-native';

function ThemeView(props) {
  const {colors} = useTheme();
  const {Component, style, secondary, third, ...rest} = props;
  const bgColor = secondary ? colors.secondaryBackground : colors.background;

  return <Component {...rest} style={[{backgroundColor: bgColor}, style]} />;
}

ThemeView.propTypes = {
  Component: PropTypes.elementType,
  secondary: PropTypes.bool,
  style: ViewPropTypes.style,
};

ThemeView.defaultProps = {
  Component: View,
  secondary: true,
  style: {},
};

export default ThemeView;
