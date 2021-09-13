import * as React from 'react';
import PropTypes from 'prop-types';
import {Dimensions} from 'react-native';
import ModalDefault from './ModalDefault';
import ModalNotification from './ModalNotification';

const SCREEN = Dimensions.get('window');

function Modal(props) {
  const {type, ...rest} = props;
  if (type === 'notification') {
    return <ModalNotification {...rest} />;
  }
  return <ModalDefault {...rest} />;
}

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
  maxHeight: PropTypes.number,
  children: PropTypes.node,
  type: PropTypes.oneOf(['default', 'notification']),
};
Modal.defaultProps = {
  type: 'default',
  visible: false,
  maxHeight: SCREEN.height - 200,
  setModalVisible: (value = false) => {},
};

export default Modal;
