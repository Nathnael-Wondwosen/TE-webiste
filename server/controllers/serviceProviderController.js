const ServiceProvider = require('../models/ServiceProvider');

const createServiceProvider = async (req, res) => {
  try {
    const service = await ServiceProvider.create({
      ...req.body,
      verified:
        req.user?.role === 'Admin' ? req.body.verified ?? false : false,
    });
    res.status(201).json(service);
  } catch (error) {
    console.error('Create service provider error', error);
    res.status(500).json({ message: 'Unable to register service provider' });
  }
};

const getServiceProviders = async (req, res) => {
  try {
    const filters = {};
    if (req.query.providerType) {
      filters.providerType = req.query.providerType;
    }
    if (req.query.verified) {
      filters.verified = req.query.verified === 'true';
    }
    const services = await ServiceProvider.find(filters).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error('Fetch service providers error', error);
    res.status(500).json({ message: 'Unable to fetch services' });
  }
};

const getServiceProviderById = async (req, res) => {
  try {
    const service = await ServiceProvider.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Get service provider error', error);
    res.status(500).json({ message: 'Unable to fetch service provider' });
  }
};

const verifyServiceProvider = async (req, res) => {
  try {
    const service = await ServiceProvider.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    service.verified = true;
    await service.save();
    res.json(service);
  } catch (error) {
    console.error('Verify service provider error', error);
    res.status(500).json({ message: 'Unable to verify service provider' });
  }
};

module.exports = {
  createServiceProvider,
  getServiceProviders,
  getServiceProviderById,
  verifyServiceProvider,
};
