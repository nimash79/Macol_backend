const admin = require("firebase-admin");

const serviceAccount = require("./config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.sendNotification = async ({title, body, token}) => {
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}