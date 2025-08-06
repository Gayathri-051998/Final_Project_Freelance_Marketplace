const Contract = require('../models/Contract');

 const createContract = async (req, res) => {
  try {
    console.log("📥 Received body:", req.body);
    console.log("👤 Authenticated user:", req.user);

    const { freelancerId, jobId } = req.body;

    if (!freelancerId || !jobId) {
      console.log("🚫 Missing freelancerId or jobId");
      return res.status(400).json({ error: 'Missing freelancerId or jobId' });
    }

    const contract = await Contract.create({
      freelancer: freelancerId,
      client: req.user._id,
      job: jobId,
    });

    console.log("✅ Contract created:", contract);
    res.status(201).json(contract);
  } catch (err) {
    console.error("❌ Failed to create contract:", err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};


const getContractsByUser = async (req, res) => {
  console.log("Fetching contracts for user:", req.user._id);

  try {
    const contracts = await Contract.find({
      $or: [{ freelancer: req.user._id }, { client: req.user._id }],
    })
      .populate('job') // 👈 make sure it's just 'job' for now
      .populate('client', 'name')
      .populate('freelancer', 'name')

    // 🔍 Add this log to see full contract objects
    
console.log(JSON.stringify(contracts, null, 2));
    console.log("📦 Contracts from DB:", JSON.stringify(contracts, null, 2));
    console.log("✅ First contract.job object:", contracts[0]?.job);
    console.log("📦 Job inside contract:", contracts[0].job);
    console.log("💸 contract[0].job.budget:", contracts[0]?.job?.budget);
    
    console.log("🧠 FULL job object sent to frontend:", JSON.stringify(contracts[0].job, null, 2));
    console.log("💸 job.budget sent to frontend:", contracts[0].job?.budget);
   
    
    res.json(contracts);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch contracts', error: err.message });
  }
};

const getUsedJobIds = async (req, res) => {
  try {
    const contracts = await Contract.find({}, 'job');
    const usedJobIds = contracts.map(contract => contract.job.toString());
    res.json(usedJobIds);
  } catch (err) {
    console.error('Error fetching used job IDs:', err);
    res.status(500).json({ message: 'Failed to fetch used job IDs' });
  }
};

const updateContractStatus = async (req, res) => {
    try {
      const updatedContract = await Contract.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        {
          new: true,
          runValidators: false,  // ✅ This prevents Mongoose from re-validating all required fields
        }
      );
  
      if (!updatedContract) {
        return res.status(404).json({ message: 'Contract not found' });
      }
  
      res.json(updatedContract);
    } catch (err) {
      console.error('Update contract error:', err.message);
      res.status(400).json({ message: 'Failed to update contract', error: err.message });
    }
  };
  
  module.exports = {
    createContract,
    getContractsByUser,
    getUsedJobIds,
    updateContractStatus,
  };
  
  
