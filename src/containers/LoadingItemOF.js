import * as React from 'react';
import Card from 'src/components/Card';
import {shadowDefault} from 'src/utils/shadow';

function LoadingItemOf(props) {
  const {style, ...rest} = props;
  return (
    <Card
      {...rest}
      style={[{height: 125, borderRadius: 8, ...shadowDefault}, style]}
    />
  );
}

export default LoadingItemOf;
