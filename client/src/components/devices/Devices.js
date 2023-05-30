import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DeviceItem from './DeviceItem';
import DeviceForm from './DeviceForm';
import { getDevices } from '../../actions/device';

const Devices = ({ getDevices, device: { devices } }) => {
  useEffect(() => {
    getDevices();
  }, [getDevices]);

  const [checkedOutVisible, setCheckedOutVisible] = useState(true);

  return (
    <Fragment>
      <h1 className="large text-primary">Devices</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome to the Topcoder Garage
      </p>
      <input
        className="m-1"
        type="checkbox"
        name="checkedOutVisible"
        value={checkedOutVisible}
        id="outVisible"
        checked
        onChange={(e) => setCheckedOutVisible(!checkedOutVisible)}
      />
      <label htmlFor="outVisible">Show Checked Out Devices</label>

      <DeviceForm />
      <div className="posts">
        {devices.map(function (device) {
          if (checkedOutVisible | !device.isCheckedOut)
            return <DeviceItem key={device._id} device={device} />;
        })}
      </div>
    </Fragment>
  );
};

Devices.propTypes = {
  getDevices: PropTypes.func.isRequired,
  device: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  device: state.device
});

export default connect(mapStateToProps, { getDevices })(Devices);
