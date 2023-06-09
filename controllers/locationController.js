import Location from "../models/Location.js";
import ShipTo from "../models/ShipTo.js";
import { v2 as cloudinary } from "cloudinary";
import QRCode from "qrcode";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { createCanvas, loadImage } from "canvas";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const addLocation = async (req, res) => {
  const { floor, location, count } = req.body;
  const { id } = req.params;
  try {
    if (!floor || !location)
      return res.status(400).json({ msg: "Please provide all values" });

    const ship = await ShipTo.findById(id);
    if (!ship)
      return res.status(404).json({ msg: "Selected ship to not found" });

    req.body.shipTo = id;
    const loc = await Location.create(req.body);

    const buf = await qrCodeGenerator(
      `https://pps.sat9.in/qr-location/${loc._id}`,
      floor,
      location
    );

    fs.writeFileSync("./files/image.jpeg", buf);

    const result = await cloudinary.uploader.upload("files/image.jpeg", {
      use_filename: true,
      folder: "service-cards",
    });

    loc.qr = result.secure_url;
    await loc.save();

    fs.unlinkSync("./files/image.jpeg");

    return res.status(201).json({ msg: "Location has been added" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const getLocationServices = async (req, res) => {
  const { id } = req.params;
  try {
    const location = await Location.findById(id).populate({
      path: "services",
      select: "serviceName serviceOption",
    });
    if (!location)
      return res
        .status(404)
        .json({ msg: "Given location not found, contact admin" });

    return res.status(200).json({ location });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const editLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const loc = await Location.findById(id);
    if (!loc) return res.status(404).json({ msg: "Location not found" });

    await Location.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ msg: "Successfully updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const deleteLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const location = await Location.findById(id);
    if (!location) return res.status(404).json({ msg: "Location not found" });
    
    await location.deleteOne();
    return res.status(200).json({ msg: "Successfully deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const getSingleShipTo = async (req, res) => {
  const { id } = req.params;
  try {
    const clientDetails = await ShipTo.findById(id);
    if (!clientDetails)
      return res.status(404).json({ msg: "Client details not found" });

    const clientLocations = await Location.find({ shipTo: id })
      .populate({
        path: "services",
        select: "serviceName",
      })
      .sort("floor");
    return res.status(200).json({ clientDetails, clientLocations });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

const qrCodeGenerator = async (link, floor, location) => {
  try {
    let height = 200,
      width = 200,
      margin = 2;

    const qrCode = await QRCode.toDataURL(link, { width, height, margin });

    // Load the QR code image into a canvas
    const canvas = createCanvas(width, height + 75);
    const ctx = canvas.getContext("2d");
    const qrCodeImg = await loadImage(qrCode);
    ctx.drawImage(qrCodeImg, 0, 25);

    // Add the bottom text to the canvas
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.font = "12px Arial";
    ctx.textAlign = "start";
    ctx.fillText(`Floor: ${floor}`, 2, height + 40);
    ctx.fillText(`Location: ${location}`, 2, height + 55);
    ctx.fillStyle = "rgb(32, 125, 192)";
    ctx.textAlign = "center";
    ctx.font = "italic bold 15px Arial";
    ctx.fillText(`Powered By Sat9`, width / 2, 15);

    const buf = canvas.toBuffer("image/jpeg");
    return buf;

    // await QRCode.toDataURL(link, options, (err, url) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   const image = new Image();
    //   image.onload = () => {
    //     const canvas = createCanvas(options.width, options.height + 75);

    //     const ctx = canvas.getContext("2d");
    //     ctx.drawImage(image, 0, 25);
    //     ctx.fillStyle = "rgb(255,255,255)";
    //     ctx.font = "12px Arial";
    //     ctx.textAlign = "start";
    //     ctx.fillText(`Floor: ${floor}`, 2, options.height + 40);
    //     ctx.fillText(`Location: ${location}`, 2, options.height + 55);
    //     ctx.fillStyle = "rgb(32, 125, 192)";
    //     ctx.textAlign = "center";
    //     ctx.font = "italic bold 15px Arial";
    //     ctx.fillText(`Powered By Sat9`, options.width / 2, 15);

    //     const buf = canvas.toBuffer("image/jpeg");
    //     fs.writeFileSync("./files/image.jpeg", buf);
    //   };
    //   image.src = url;
    // });

    // const stringdata = `http://localhost:3000/location/${id}`;
    // await QRCode.toFile(`qrcode.png`, stringdata, { width: 60, margin: 15 });

    // const image = await Jimp.read("qrcode.png");
    // const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    // image.print(font, 10, 193, `location: ${location}`);
    // await image.writeAsync("textOverlay.png");
    // //  const result = await cloudinary.uploader.upload(`files/${name}.png`, {
    // //    width: 80,
    // //    height: 80,
    // //    use_filename: true,
    // //    folder: "service-cards",
    // //  });
  } catch (error) {
    console.log(error);
    return error;
  }
};
