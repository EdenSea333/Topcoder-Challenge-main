import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addDevice } from '../../actions/device';

const DeviceForm = ({ addDevice }) => {
  const [model, setModel] = useState('');
  const [os, setOs] = useState('');
  const [manufacturer, setManufacturer] = useState('');

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Fill below...</h3>
      </div>
      <form
        className="form my-1"
        onSubmit={(e) => {
          e.preventDefault();
          addDevice({ model, os, manufacturer });
          setModel('');
          setOs('');
          setManufacturer('');
        }}
      >
        <input
          className="m-1"
          type="text"
          placeholder="Device Model"
          name="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
        />
        <input
          className="m-1"
          type="text"
          placeholder="Device Operating System"
          name="os"
          value={os}
          onChange={(e) => setOs(e.target.value)}
          required
        />
        <input
          className="m-1"
          type="text"
          placeholder="Device Manufacturer"
          name="manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
          required
        />
        <input className="m-1 btn btn-dark" type="submit" value="Submit" />
      </form>
    </div>
  );
};

DeviceForm.propTypes = {
  addDevice: PropTypes.func.isRequired
};

export default connect(null, { addDevice })(DeviceForm);
