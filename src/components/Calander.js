import React, { useState } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Calendar} from 'react-native-calendars';
const Calander = ({refCalander, serachByDay}) => {
  const [currenDate, setCurrentDate] = useState(new Date());
  return (
    <RBSheet
      ref={refCalander}
      animationType="fade"
      height={500}
      closeOnDragDown={true}
      closeOnPressMask={false}
      customStyles={{
        wrapper: {
          backgroundColor: '#000000CC',
        },
        draggableIcon: {
          backgroundColor: '#000',
        },
      }}>
      <Calendar
        current={currenDate}
        onDayPress={day => serachByDay(day)}
        enableSwipeMonths={true}
      />
    </RBSheet>
  );
};

export default Calander;
