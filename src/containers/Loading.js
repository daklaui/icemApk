import * as React from 'react';
import PropTypes from 'prop-types';
import {View, ViewPropTypes} from 'react-native';

function Loading(props) {
  const {ItemComponent, count, pad, containerStyle} = props;
  let results = [];
  for (let i = 0; i < count; i++) {
    results.push(
      <ItemComponent key={i} style={i !== count - 1 && {marginBottom: pad}} />,
    );
  }
  return <View style={containerStyle}>{results.map(data => data)}</View>;
}

Loading.propsTypes = {
  ItemComponent: PropTypes.elementType.isRequired,
  count: PropTypes.number,
  pad: PropTypes.number,
  containerStyle: ViewPropTypes.style,
};
Loading.defaultProps = {
  count: 10,
  pad: 12,
  containerStyle: {},
};
export default Loading;
