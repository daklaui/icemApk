import * as React from 'react';
import PropTypes from 'prop-types';
import {useTheme} from '@react-navigation/native';
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import Card from 'src/components/Card';

const SCREEN = Dimensions.get('window');

class ModalNotification extends React.Component {
  constructor(props) {
    super(props);
    const {visible} = props;
    const opacity = visible ? 0.7 : 0;
    this.state = {
      visible: props.visible,
      opacity: new Animated.Value(opacity),
      heightView: 0,
    };
  }
  animation = (type = 'open', cb = () => {}) => {
    const toValue = type === 'open' ? 0.7 : 0;
    const duration = 350;
    Animated.timing(this.state.opacity, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start(cb);
  };

  onShow = () => {
    this.animation();
  };

  componentDidUpdate(preProps) {
    const {visible} = this.props;
    // Close
    if (!visible && preProps.visible !== visible) {
      this.animation('close', () => this.updateVisible(visible));
    }
    // Open
    if (visible && preProps.visible !== visible) {
      this.updateVisible(visible);
    }
  }
  updateVisible = visible => {
    this.setState({visible});
  };
  render() {
    const {setModalVisible, maxHeight, children, theme} = this.props;
    const {visible, opacity, heightView} = this.state;
    const pad = (SCREEN.height - heightView) / 2;
    const bottom = opacity.interpolate({
      inputRange: [0, 0.7],
      outputRange: [-heightView, pad],
    });

    return (
      <Modal
        visible={visible}
        transparent
        onRequestClose={() => setModalVisible(false)}
        onShow={this.onShow}>
        <Animated.View
          style={[
            styles.viewOpacity,
            {
              backgroundColor: theme.colors.modal,
              opacity: opacity,
            },
          ]}>
          <TouchableOpacity
            style={styles.touch}
            onPress={() => setModalVisible(false)}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.content,
            {
              bottom: bottom,
            },
          ]}>
          <Card
            secondary={false}
            onLayout={event => {
              const {height} = event.nativeEvent.layout;
              this.setState({
                heightView: height > maxHeight ? maxHeight : height,
              });
            }}
            style={[
              styles.viewChildren,
              {
                maxHeight,
              },
            ]}>
            {children}
          </Card>
        </Animated.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  viewOpacity: {
    flex: 1,
  },
  touch: {
    flex: 1,
  },
  content: {
    justifyContent: 'flex-end',
    position: 'absolute',
    left: 40,
    right: 40,
  },
  viewChildren: {
    borderRadius: 8,
    paddingVertical: 10,
  },
});

ModalNotification.propTypes = {
  visible: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
  maxHeight: PropTypes.number,
  children: PropTypes.node,
};
ModalNotification.defaultProps = {
  visible: false,
  maxHeight: SCREEN.height - 200,
  setModalVisible: (value = false) => {},
};

export default function ModalDefaultComponent(props) {
  const theme = useTheme();
  return <ModalNotification {...props} theme={theme} />
}
