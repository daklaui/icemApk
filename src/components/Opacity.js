import React from 'react';
import PropTypes from 'prop-types';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View, ViewPropTypes} from 'react-native';

function OpacityView(props) {
  const {colors} = useTheme();
  const {opacity, bgColor, children, style} = props;
  const backgroundColor = bgColor ?? colors.background;

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        style && style,
        styles.containerView,
      ])}>
      <View
        style={[
          styles.boxOpacity,
          {
            opacity: opacity,
            backgroundColor,
          },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  containerView: {
    backgroundColor: 'transparent',
  },
  boxOpacity: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

OpacityView.propTypes = {
  opacity: PropTypes.number,
  bgColor: PropTypes.string,
  style: ViewPropTypes.style,
  children: PropTypes.node,
};
OpacityView.defaultProps = {
  opacity: 0.5,
  style: {},
};

export default OpacityView;
