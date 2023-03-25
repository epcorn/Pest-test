import Admin from "../models/Admin.js";
import ShipTo from "../models/ShipTo.js";

export const addService = async (req, res) => {
  const { serviceName, serviceOption } = req.body;
  try {
    if (!serviceName || !serviceOption)
      return res.status(400).json({ msg: "Please provide all values" });

    let company = req.user.company;

    const alreadyExists = await Admin.findOne({ serviceName, company });
    if (alreadyExists)
      return res
        .status(400)
        .json({ msg: `${serviceName} service already exists` });

    req.body.company = company;
    const service = await Admin.create(req.body);
    return res
      .status(201)
      .json({ msg: `${service.serviceName} service has been added` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const getCompanyServices = async (req, res) => {
  try {
    const services = await Admin.find({ company: req.user.company })
      .select("serviceName serviceOption")
      .sort("-createdAt");
    const allShipTo = await ShipTo.find({ company: req.user.company });
    return res.status(200).json({ services, allShipTo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const editService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Admin.findById(id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    await Admin.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ msg: "Service has been updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Admin.findById(id);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    await service.deleteOne()
    return res.status(200).json({ msg: "Service has been deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
