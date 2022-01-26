import admin from "firebase-admin";
import chalk from "chalk";
import debug from "debug";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "proyecto-final-martayluis.appspot.com",
});

const firebase = async (req, res, next) => {
  try {
    const bucket = admin.storage().bucket();
    await bucket.upload(req.file.path);
    await bucket.file(req.file.filename).makePublic();
    const fileURL = bucket.file(req.file.filename).publicUrl();
    debug(chalk.green(fileURL));
    req.file.fileURL = fileURL;
    next();
  } catch (error) {
    error.code = 400;
    error.message = "Something failed while uploading to firebase";
    next(error);
  }
};

export default firebase;
