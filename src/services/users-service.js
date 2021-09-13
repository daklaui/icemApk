import request from 'src/utils/fetch';

export const getAllUsers = userToken => request.get('user', {}, userToken);
export const getUserById = (userToken, id) =>
  request.get('user/' + id, {}, userToken);
export const deleteUSer = (userToken, id) =>
  request.Delete('user/' + id, {}, userToken);
export const AddUser = (userToken, data) =>
  request.post('user', JSON.stringify(data), 'POST', userToken);
export const UpdateUser = (userToken, data) =>
  request.post('user', JSON.stringify(data), 'PUT', userToken);
