const Advertisement = require('../models/Advertisement');

const createAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(ad);
  } catch (error) {
    console.error('Create advertisement error', error);
    res.status(500).json({ message: 'Unable to create advertisement' });
  }
};

const getAdvertisements = async (req, res) => {
  try {
    const filters = {};
    if (req.query.featured) filters.featured = req.query.featured === 'true';
    if (req.query.approved) filters.approved = req.query.approved === 'true';
    const adverts = await Advertisement.find(filters)
      .populate('product', 'name price')
      .populate('company', 'name country');
    res.json(adverts);
  } catch (error) {
    console.error('List advertisements error', error);
    res.status(500).json({ message: 'Unable to load advertisements' });
  }
};

const approveAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }
    ad.approved = true;
    ad.status = 'Approved';
    await ad.save();
    res.json(ad);
  } catch (error) {
    console.error('Approve advertisement error', error);
    res.status(500).json({ message: 'Unable to approve advertisement' });
  }
};

module.exports = {
  createAdvertisement,
  getAdvertisements,
  approveAdvertisement,
};
