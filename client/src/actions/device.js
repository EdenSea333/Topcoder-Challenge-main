import api from '../utils/api';
import { setAlert } from './alert';
import {
  ADD_DEVICE,
  GET_DEVICES,
  DELETE_DEVICE,
  GET_DEVICE,
  DEVICE_ERROR,
  ADD_FEEDBACK,
  REMOVE_FEEDBACK,
  CHECKOUT_DEVICE,
  CHECKIN_DEVICE
} from './types';

// Get devices
export const getDevices = () => async (dispatch) => {
  try {
    const res = await api.get('/devices');
    dispatch({
      type: GET_DEVICES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: DEVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete device
export const deleteDevice = (id) => async (dispatch) => {
  try {
    await api.delete(`/devices/${id}`);

    dispatch({
      type: DELETE_DEVICE,
      payload: id
    });

    dispatch(setAlert('Device Removed', 'success'));
  } catch (err) {
    dispatch({
      type: DEVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add device
export const addDevice = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/devices', formData);

    dispatch({
      type: ADD_DEVICE,
      payload: res.data
    });
    dispatch(setAlert('Device Created', 'success'));
  } catch (err) {
    dispatch(setAlert(err.response.data, 'warning'));
    dispatch({
      type: DEVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get device
export const getDevice = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/devices/${id}`);

    dispatch({
      type: GET_DEVICE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: DEVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Check out a device
export const checkOutDevice = (id) => async (dispatch) => {
  try {
    const res = await api.post(`/devices/checkout/${id}`);

    dispatch({
      type: CHECKOUT_DEVICE,
      payload: res.data
    });
    dispatch(setAlert('Checked out this device.', 'success'));
  } catch (err) {
    dispatch(setAlert(err.response.data, 'danger'));
    dispatch({
      type: DEVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Check in a device
export const checkInDevice = (id) => async (dispatch) => {
  try {
    const res = await api.post(`/devices/checkin/${id}`);

    dispatch({
      type: CHECKIN_DEVICE,
      payload: res.data
    });
    dispatch(setAlert('Checked in this device.', 'success'));
  } catch (err) {
    dispatch(setAlert(err.response.data, 'danger'));
    dispatch({
      type: DEVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
// Add feedback
export const addFeedback = (deviceId, formData) => async (dispatch) => {
  try {
    const res = await api.post(`/devices/feedback/${deviceId}`, formData);

    dispatch({
      type: ADD_FEEDBACK,
      payload: res.data
    });

    dispatch(setAlert('Feedback Added', 'success'));
  } catch (err) {
    dispatch({
      type: DEVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete feedback
export const removeFeedback = (deviceId, feedbackId) => async (dispatch) => {
  try {
    await api.delete(`/devices/feedback/${deviceId}/${feedbackId}`);

    dispatch({
      type: REMOVE_FEEDBACK,
      payload: feedbackId
    });

    dispatch(setAlert('Feedback Removed', 'success'));
  } catch (err) {
    dispatch({
      type: DEVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
