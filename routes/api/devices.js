const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Device = require('../../models/Device');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/devices
// @desc     Add a Device
// @access   Private
router.post(
  '/',
  auth,
  check('model', 'model is required').notEmpty(),
  check('os', 'os is required').notEmpty(),
  check('manufacturer', 'manufacturer is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const deviceNumber = await Device.count();
      if (deviceNumber >= 10) {
        return res.status(400).send('There is no space for new devices.');
      }
      const user = await User.findById(req.user.id).select('-password');

      const newDevice = new Device({
        model: req.body.model,
        os: req.body.os,
        manufacturer: req.body.manufacturer,
        registeredBy: user.id
      });

      const device = await newDevice.save();

      res.json(device);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/devices
// @desc     Get all devices
// @access   public
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find().sort({ date: -1 });
    res.json(devices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/devices/:id
// @desc     Delete a Device
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).send('Device not found');
    }

    // Check user
    if (device.registeredBy.toString() !== req.user.id) {
      return res.status(401).send('User not authorized');
    }

    await device.remove();

    res.json({ msg: 'Device removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    PUT api/devices/feedback/:id
// @desc     Review a device
// @access   Private
router.put('/feedback/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    // Check if the device has already been reviewd
    if (
      device.feedbacks.some(
        (feedback) => feedback.user.toString() === req.user.id
      )
    ) {
      return res.status(400).send('You already reviewd this device');
    }

    const user = await User.findById(req.user.id).select('-password');
    device.feedbacks.unshift({
      user: req.user.id,
      name: user.name,
      rating: req.body.rating,
      text: req.body.text
    });

    await device.save();

    return res.json(device.feedbacks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    Delete api/devices/feedback/:id
// @desc     Delete feedback
// @access   Private
router.delete('/feedback/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    // Check if the device has not yet been reviewd
    if (
      !device.feedbacks.some(
        (feedback) => feedback.user.toString() === req.user.id
      )
    ) {
      return res.status(400).json('Device has not yet been reviewed.');
    }

    // remove the feedback
    device.feedbacks = device.feedbacks.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await device.save();

    return res.json(device.feedbacks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    CHECK OUT api/devices/checkout/:id
// @desc     Check out a Device
// @access   Private
router.post('/checkout/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    // Ensure the time is available for handling check out
    const currentHours = new Date().getHours();
    console.log(currentHours);
    if (currentHours < 15 || currentHours > 17) {
      return res
        .status(405)
        .send('You are not allowed to check out any device this time.'); //Method Not Allowed
    }

    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json('Device not found'); // Not found
    }

    // User
    const user = await User.findById(req.user.id);

    // Check if another device is checked out by this user
    const anotherDevice = await Device.findOne({
      lastCheckedOutBy: user.id,
      isCheckedOut: true
    });
    if (anotherDevice) {
      return res.status(405).send('You already checked out another device.'); //Method Not Allowed
    }

    // Check if the device is already checked out
    if (device.isCheckedOut) {
      return res.status(404).send('Device is already checked out.');
    }

    // Checkout device
    device.isCheckedOut = true;
    device.lastCheckedOutBy = user.id;
    device.lastCheckedOutDate = Date.now();

    await device.save();

    const devices = await Device.find().sort({ date: -1 });
    res.json(devices);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    CHECK IN api/devices/checkout/:id
// @desc     Check in a Device
// @access   Private
router.post('/checkin/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).send('Device not found'); // Not found
    }

    // Check if the device is checked out
    if (!device.isCheckedOut) {
      return res.status(404).send("Device isn't checked out.");
    }

    // User
    const user = await User.findById(req.user.id);

    // Check if the device is checked out by this user

    if (device.lastCheckedOutBy != user.id) {
      return res.status(405).send("This deviced isn't checked out by you."); //Method Not Allowed
    }

    // Check in device
    device.isCheckedOut = false;
    device.lastCheckedInDate = Date.now();

    await device.save();
    const devices = await Device.find().sort({ date: -1 });
    res.json(devices);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

module.exports = router;
