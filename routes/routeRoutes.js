const express = require('express');
const Route = require('../models/Route');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try { return res.status(200).json(await Route.find().sort({ createdAt: -1 })); }
  catch (error) { return res.status(500).json({ message: 'Could not retrieve routes.', error: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { startLocation, endLocation, riskLevel, estimatedTime, distanceKm, safetyScore, transportMode, notes } = req.body;
    if (!startLocation || !endLocation || !estimatedTime) return res.status(400).json({ message: 'Start location, end location and estimated time are required.' });
    const route = await Route.create({ startLocation, endLocation, riskLevel, estimatedTime, distanceKm, safetyScore, transportMode, notes, user: req.user.id });
    return res.status(201).json(route);
  } catch (error) { return res.status(500).json({ message: 'Could not create route.', error: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!route) return res.status(404).json({ message: 'Route not found.' });
    return res.status(200).json(route);
  } catch (error) { return res.status(500).json({ message: 'Could not update route.', error: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found.' });
    return res.status(200).json({ message: 'Route deleted successfully.' });
  } catch (error) { return res.status(500).json({ message: 'Could not delete route.', error: error.message }); }
});
module.exports = router;
