import * as React from 'react';
import PropTypes from 'prop-types';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';

function Line(props) {
  const {colors} = useTheme();
  const {direction, height, color, type} = props;
  const borderRadius = type === 'solid' ? 0 : 1;
  const colorLine = color ?? colors.text;

  if (direction === 'vertical') {
    return (
      <View
        style={StyleSheet.flatten([styles.containerVertical, {width: height}])}>
        <View
          style={{
            borderWidth: height,
            borderColor: colorLine,
            borderStyle: type,
            borderRadius: borderRadius,
            height: '100%',
          }}
        />
      </View>
    );
  }
  return (
    <View style={StyleSheet.flatten([styles.container, {height}])}>
      <View
        style={{
          borderWidth: height,
          borderColor: colorLine,
          borderStyle: type,
          borderRadius: borderRadius,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  containerVertical: {
    flex: 1,
    overflow: 'hidden',
  },
});

Line.propTypes = {
  height: PropTypes.number,
  color: PropTypes.string,
  type: PropTypes.oneOf(['solid', 'dotted', 'dashed']),
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
};

Line.defaultProps = {
  height: 1,
  type: 'solid',
  direction: 'horizontal',
};
export default Line;
