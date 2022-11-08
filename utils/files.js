import multer from "multer";
export const fileStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.mimetype.split("/")[0] === "video") {
      cb(null, "videos");
    } else {
      cb(null, "images");
    }
  },
  filename: (_req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

export const fileFilter = (_req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "video/webm" ||
    file.mimetype === "video/x-m4v" ||
    file.mimetype === "video/x-matroska"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
