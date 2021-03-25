import { firebase } from '../src/firebase/config'

export default class AppointmentPhoto {
    
    uid = ""
    barberUID = ""
    appointmentUID = ""
    photoURL = ""
    
    setAndUpdateImage(imageURI) {
        const imageRef = firebase.storage().ref('AppointmentPhotos').child(this.uid);
        return new Promise(resolve => {
            fetch(imageURI).then(response => {
                response.blob().then( blob => {
                    imageRef.put(blob).then(() => {
                        imageRef.getDownloadURL().then(async (url) => {
                            this.photoURL = url
                            await this.update();
                            console.log("XX photo updated!", this.photoURL);
                            resolve(true);
                        })
                    })
                })
            })
        })
    }
    
    update() {
        var appointmentPhotoRef = firebase.firestore().collection('AppointmentPhotos').doc(this.uid);
        
        return new Promise(resolve => {
            appointmentPhotoRef.update({
                barberUID: this.barberUID,
                appointmentUID: this.appointmentUID,
                photoURL: this.photoURL,
            })
            resolve(true);
        });
    }
    
    static createNew(fromID = "") {
        var appointmentPhoto = new AppointmentPhoto();
        
        return new Promise(resolve => {
            if (fromID == "") {
                firebase.firestore().collection('AppointmentPhotos').add({
                    barberUID: appointmentPhoto.barberUID,
                    appointmentUID: appointmentPhoto.appointmentUID,
                    photoURL: appointmentPhoto.photoURL,
                }).then(function(docRef) {
                    appointmentPhoto.uid = docRef.id;
                    resolve(appointmentPhoto);
                })
            } else {
                firebase.firestore().collection('AppointmentPhotos').doc(fromID).set({
                    barberUID: appointmentPhoto.barberUID,
                    appointmentUID: appointmentPhoto.appointmentUID,
                    photoURL: appointmentPhoto.photoURL,
                })
                
                appointmentPhoto.uid = fromID;
                resolve(appointmentPhoto);
            }
        });
    }
    
    static loadFromID(id) {
        
        var appointmentPhoto = new AppointmentPhoto();
        return new Promise(resolve => {
            firebase.firestore().collection('AppointmentPhotos').doc(id).get().then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    let data = documentSnapshot.data();
                    console.log("IN PHOTO LOADFROMID, DOCUMENTSNAPSHOT.DATA IS", data);
                    appointmentPhoto.uid = documentSnapshot.documentID
                    appointmentPhoto.barberUID = data["barberUID"]
                    appointmentPhoto.appointmentUID = data["appointmentUID"]
                    appointmentPhoto.photoURL = data["photoURL"]
                    
                    resolve(appointmentPhoto);
                } else {
                    resolve(null);
                }
            });
        });
    }
}
