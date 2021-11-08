import request from 'src/utils/fetch';

export const getAllOfs = userToken => request.get('Of', {}, userToken);
export const getOfs = userToken => request.get('Of/getOfs', {}, userToken);
export const FilterOfs = (userToken, ofname = '', ofSource = '', date) => {
  return date !== undefined
    ? request.get(`Of/FilterOfs/${ofname}/${ofSource}/${date}`, {}, userToken)
    : request.get(`Of/FilterOfs/${ofname}/${ofSource}`, {}, userToken);
};
export const getOfsByStatus = (userToken, status) =>
  request.get('Of/getOfByStatus/' + status, {}, userToken);
export const getOfsByEtat = (userToken, etat) =>
  request.get('Of/getOfByEtat/' + etat, {}, userToken);
export const addNewOfATracker = (userToken, of) =>
  request.post('Of/addTrackNewOf', JSON.stringify(of), 'POST', userToken);
export const addNewOfATrackerList = (userToken, of) =>
  request.post('Of/addTrackNewOfs', JSON.stringify(of), 'POST', userToken);
export const updateStateOf = (userToken, of) =>
  request.post('Of/changeStateOf', JSON.stringify(of), 'PUT', userToken);
export const getCountOfByEtat = userToken =>
  request.get('Of/getCountOfByEtat', {}, userToken);
export const GetHistoriqueOf = (userToken, no) =>
  request.get('Of/GetHistoriqueOf/' + no, {}, userToken);
export const GetUsersByEtat = (userToken, etat) =>
  request.get(`User/getUsersByEtat/${etat}`, {}, userToken);
export const getSearchUsersByEtat = (userToken, etat, username) =>
  request.get(`User/getSearchUsersByEtat/${etat}/${username}`, {}, userToken);
export const GetOfByActionneur = (userToken, etat, username) =>
  request.get(`Of/GetOfByActionneur/${etat}/${username}`, {}, userToken);
export const getOfByEtatStatus = (userToken, etat, status) =>
  request.get(`Of/getOfByEtatStatus/${etat}/${status}`, {}, userToken);
export const GetOfTracksByOfName = (userToken, no, source, etat, date) =>
  date
    ? request.get(
        `Of/GetOfTracksByOfName/${no}/${source}/${etat}/${date}`,
        {},
        userToken,
      )
    : request.get(
        `Of/GetOfTracksByOfName/${no}/${source}/${etat}`,
        {},
        userToken,
      );
