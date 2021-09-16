import request from 'src/utils/fetch';

export const getAllOfs = userToken => request.get('Of', {}, userToken);
export const getOfs = userToken => request.get('Of/getOfs', {}, userToken);
export const addNewOfATracker = (userToken, of) =>
  request.post('Of/addTrackNewOf', JSON.stringify(of), 'POST', userToken);
