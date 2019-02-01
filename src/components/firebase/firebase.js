import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';
import _config from 'configFirebase';

const prodConfig = {
  apiKey: _config.REACT_APP_API_KEY,
  authDomain: _config.REACT_APP_AUTH_DOMAIN,
  databaseURL: _config.REACT_APP_DATABASE_URL,
  projectId: _config.REACT_APP_PROJECT_ID,
  storageBucket: _config.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: _config.REACT_APP_MESSAGING_SENDER_ID
};

const devConfig = {
  apiKey: _config.REACT_APP_API_KEY,
  authDomain: _config.REACT_APP_AUTH_DOMAIN,
  databaseURL: _config.REACT_APP_DATABASE_URL,
  projectId: _config.REACT_APP_PROJECT_ID,
  storageBucket: _config.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: _config.REACT_APP_MESSAGING_SENDER_ID
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();

    this.storage = app.storage().ref();
  }

  // doCreateUserWithEmailAndPassword = (email, password) =>
  //   this.auth.createUserWithEmailAndPassword(email, password);

  // doSignInWithEmailAndPassword = (email, password) =>
  //   this.auth.signInWithEmailAndPassword(email, password);

  // doSignOut = () => this.auth.signOut();

  // doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  // doPasswordUpdate = password =>
  //   this.auth.currentUser.updatePassword(password);

  // user = uid => this.db.ref(`users/${uid}`);

  // users = () => this.db.ref('users');

  getStorage = () => this.storage;

  getImageUrl = async (image) => {
    let urlImage = '';
    await this.storage.child(`${image}`).getDownloadURL().then((url) => {
      urlImage = url;
    }).catch((error) => {
      return urlImage;
    });

    return urlImage;
  }

  uploadFile = async (file) => {
    // Create the file metadata
    // var metadata = {
    //   contentType: 'image/jpeg'
    // };

    const uploadTask = this.storage.child('images/' + file.name).put(file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            break;
          case 'storage/canceled':
            break;
          case 'storage/unknown':
            break;
        }
      }, 
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
        });
      }
    );
  }
}

export default Firebase;