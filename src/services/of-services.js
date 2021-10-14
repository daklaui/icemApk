import request from 'src/utils/fetch';

export const getAllOfs = userToken => request.get('Of', {}, userToken);
export const getOfs = userToken => request.get('Of/getOfs', {}, userToken);
export const getOfsByStatus = (userToken, status) =>
  request.get('Of/getOfByStatus/' + status, {}, userToken);
export const getOfsByEtat = (userToken, etat) =>
  request.get('Of/getOfByEtat/' + etat, {}, userToken);
export const addNewOfATracker = (userToken, of) =>
  request.post('Of/addTrackNewOf', JSON.stringify(of), 'POST', userToken);
export const updateStateOf = (userToken, of) =>
  request.post('Of/changeStateOf', JSON.stringify(of), 'PUT', userToken);
export const getCountOfByEtat = userToken =>
  request.get('Of/getCountOfByEtat', {}, userToken);
export const GetHistoriqueOf = (userToken, no) =>
  request.get('Of/GetHistoriqueOf/' + no, {}, userToken);
export const GetOfTracksByOfName = (userToken, no, etat, date) =>
  date
    ? request.get(`Of/GetOfTracksByOfName/${no}/${etat}/${date}`, {}, userToken)
    : request.get(`Of/GetOfTracksByOfName/${no}/${etat}`, {}, userToken);
