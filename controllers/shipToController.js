import ShipTo from "../models/ShipTo.js";

const capitalLetter = (phrase) => {
  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const addShipTo = async (req, res) => {
  const { shipToName, shipToAddress } = req.body;
  try {
    if (!shipToName || !shipToAddress)
      return res.status(400).json({ msg: "Please provide all values" });

    const alreadyShipTo = await ShipTo.findOne({
      shipToName: { $regex: shipToName, $options: "i" },
      company: req.user.company,
    });
    if (alreadyShipTo)
      return res.status(400).json({ msg: `${shipToName} already exists` });

    req.body.shipToName = capitalLetter(shipToName);
    req.body.company = req.user.company;
    const shipTo = await ShipTo.create(req.body);

    return res
      .status(201)
      .json({ msg: `${shipTo.shipToName} has been added`, id: shipTo._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
