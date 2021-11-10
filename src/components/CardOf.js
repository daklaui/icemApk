import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors} from 'react-native-elements';
import Text from 'src/components/Text';
import {StatusColors} from '../configs/colors';
import {getDateCustom} from '../utils/time';
const CardOf = ({item, onChangeScreen, selectedItem, longPressHandled}) => {
  let borderColor;
  let status = item.statusOf ? item.statusOf : '';
  switch (status) {
    case 'Urgent':
      borderColor = StatusColors.Urgent;
      break;
    case 'Urgent,Partiel':
      borderColor = StatusColors.UrgentPartielle;
      break;
    case 'Normal,Partiel':
      borderColor = StatusColors.NormalPartielle;
      break;
    case 'Retard':
      borderColor = StatusColors.Retard;
      break;
    case 'StoppeP':
      borderColor = StatusColors.StoppeP;
      break;
    case 'StoppeQ':
      borderColor = StatusColors.StoppeQ;
      break;
    case 'Annulé':
      borderColor = StatusColors.Annuler;
      break;
    default:
      borderColor = StatusColors.Normal;
      break;
  }

  return (
    <TouchableOpacity
      key={item.dateAction}
      style={[styles.card, {borderColor: borderColor}]}
      onPress={() => onChangeScreen(item)}
      onLongPress={() => longPressHandled(item)}>
      <View style={styles.cardContent}>
        {/*<Text style={[styles.description, getDescriptionStyle(item)]}>{item.description}</Text>*/}
        <View style={styles.row}>
          <Text style={[styles.titre]}>{item.no}</Text>
          <Text style={[styles.titreSourceN]}>{item.sourceNo}</Text>
        </View>
        <Text style={[styles.description]}>
          {item.actionneur
            ? `actionneur : ${item.actionneur}`
            : item.description}
        </Text>
        <View style={[styles.row, {alignItems: 'center', marginTop: 6}]}>
          <Text style={styles.date}>{getDateCustom(item.dateAction)}</Text>
          <Text style={styles.quantite}>{`Quantité : ${item.quantity}`}</Text>
        </View>
       
      </View>
      {selectedItem(item.no) && <View style={styles.overlay} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    marginLeft: 10,
    marginTop: 10,
    padding: 10,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
        width: 0,
        height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: 'white',
    overflow: 'hidden',
    borderRadius: 5,
    borderLeftWidth: 6,
},
  titre: {
    fontSize: 18,
    flex: 1,
    color: '#008080',
    fontWeight: 'bold',
  },
  titreSourceN: {
    fontSize: 18,
    color: '#008080',
    fontWeight: 'bold',
  },
  description: {
    marginTop: 5,
    fontSize: 12,
    flex: 1,
    color: colors.text,
    fontWeight: 'bold',
  },
  quantite: {
    fontSize: 15,
    color: colors.error,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#696969',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    left: 0,
    top: 0,
  },
});
export default CardOf;
