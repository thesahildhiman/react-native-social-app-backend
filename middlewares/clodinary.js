const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dulpys8vh",
  api_key: "161615789741491",
  api_secret: "UjhjA45sea9KSlMW8GfClgc_vdo",
});

async function handleUpload(file, fileName) {
  const res = await cloudinary.uploader.upload(file, {
    public_id: fileName,
    resource_type: "auto",
  });
  return res.secure_url;
}

module.exports = handleUpload;
