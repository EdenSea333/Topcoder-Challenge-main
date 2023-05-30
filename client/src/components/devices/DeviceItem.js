import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import { connect } from 'react-redux';
import {
  addFeedback,
  removeFeedback,
  deleteDevice,
  checkInDevice,
  checkOutDevice
} from '../../actions/device';

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

const DeviceItem = ({
  addFeedback,
  removeFeedback,
  deleteDevice,
  auth,
  checkInDevice,
  checkOutDevice,
  device: {
    _id,
    model,
    os,
    manufacturer,
    feedbacks,
    registeredDate,
    registeredBy,
    isCheckedOut,
    lastCheckedOutDate,
    lastCheckedOutBy
  },
  showActions
}) => (
  <div
    className={
      'post bg-white p-1 my-1 ' +
      (isCheckedOut ? 'checkedout ' : ' ') +
      (Date.now() / _MS_PER_DAY -
        Date.parse(lastCheckedOutDate) / _MS_PER_DAY >=
      7
        ? 'overrent'
        : '')
    }
  >
    <div className="device-info">
      <span className="my-1">{model}</span>
      <span className="my-1"> ({os}) </span>
      <span className="my-1"> (Made by {manufacturer}) </span>
      <span className="post-date">
        Registered on {formatDate(registeredDate)}
      </span>
    </div>
    <div className="device-check-info">
      {lastCheckedOutDate && isCheckedOut && (
        <span className="my-1">
          Check out for{' '}
          {parseInt(
            Date.now() / _MS_PER_DAY -
              Date.parse(lastCheckedOutDate) / _MS_PER_DAY
          )}{' '}
          days.
        </span>
      )}
    </div>
    <div className="device-edit">
      {showActions && (
        <Fragment>
          {!isCheckedOut && (
            <button
              onClick={() => checkOutDevice(_id)}
              type="button"
              className="btn btn-light"
              title="Check out"
            >
              <i className="fas fa-box-open" />{' '}
              <span>
                {feedbacks.length > 0 && <span>{feedbacks.length}</span>}
              </span>
            </button>
          )}
          {isCheckedOut && lastCheckedOutBy === auth.user._id && (
            <button
              onClick={() => checkInDevice(_id)}
              type="button"
              className="btn btn-light"
              title="Check in"
            >
              <i className="fas fa-box" />
            </button>
          )}
          {/* <Link to={`/devices/${_id}`} className="btn btn-primary">
            Review{' '}
            {feedbacks.length > 0 && (
              <span className="comment-count">{feedbacks.length}</span>
            )}
          </Link> */}
          {!auth.loading && registeredBy === auth.user._id && (
            <button
              onClick={() => deleteDevice(_id)}
              type="button"
              className="btn btn-danger"
            >
              <i className="fas fa-times" />
            </button>
          )}
        </Fragment>
      )}
    </div>
  </div>
);

DeviceItem.defaultProps = {
  showActions: true
};

DeviceItem.propTypes = {
  device: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addFeedback: PropTypes.func.isRequired,
  removeFeedback: PropTypes.func.isRequired,
  deleteDevice: PropTypes.func.isRequired,
  checkInDevice: PropTypes.func.isRequired,
  checkOutDevice: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  addFeedback,
  removeFeedback,
  deleteDevice,
  checkInDevice,
  checkOutDevice
})(DeviceItem);
