import {
  GET_DEVICES,
  DEVICE_ERROR,
  UPDATE_LIKES,
  DELETE_DEVICE,
  ADD_DEVICE,
  GET_DEVICE,
  ADD_FEEDBACK,
  REMOVE_FEEDBACK,
  CHECKIN_DEVICE,
  CHECKOUT_DEVICE
} from '../actions/types';

const initialState = {
  devices: [],
  device: null,
  loading: true,
  error: {}
};

function deviceReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_DEVICES:
      return {
        ...state,
        devices: payload,
        loading: false
      };
    case GET_DEVICE:
      return {
        ...state,
        device: payload,
        loading: false
      };
    case ADD_DEVICE:
      return {
        ...state,
        devices: [payload, ...state.devices],
        loading: false
      };
    case DELETE_DEVICE:
      return {
        ...state,
        devices: state.devices.filter((device) => device._id !== payload),
        loading: false
      };
    case DEVICE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        devices: state.devices.map((device) =>
          device._id === payload.id
            ? { ...device, likes: payload.likes }
            : device
        ),
        loading: false
      };
    case ADD_FEEDBACK:
      return {
        ...state,
        device: { ...state.device, comments: payload },
        loading: false
      };
    case CHECKIN_DEVICE:
      return {
        ...state,
        devices: payload,
        loading: false
      };
    case CHECKOUT_DEVICE:
      return {
        ...state,
        devices: payload,
        loading: false
      };
    case REMOVE_FEEDBACK:
      return {
        ...state,
        device: {
          ...state.device,
          comments: state.device.comments.filter(
            (comment) => comment._id !== payload
          )
        },
        loading: false
      };
    default:
      return state;
  }
}

export default deviceReducer;
