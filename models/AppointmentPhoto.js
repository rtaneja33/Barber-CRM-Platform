import { firebase } from '../src/firebase/config'

class AppointmentPhoto {
    
    uid = ""
    barberUID = ""
    appointmentUID = ""
    photoURL = ""
    
    update() {
        var appointmentPhotoRef = firebase.firestore().collection('AppointmentPhotos').doc(uid);
        
        return new Promise(resolve => {
            appointmentPhotoRef.update({
                barberUID: barberUID,
                appointmentUID: appointmentUID,
                photoURL: photoURL,
            })
            resolve(true);
          });
    }
    
    static createNew() {
        var appointmentPhoto = new AppointmentPhoto();
        
        return new Promise(resolve => {
            firebase.firestore().collection('AppointmentPhotos').add({
                barberUID: appointmentPhoto.barberUID,
                appointmentUID: appointmentPhoto.appointmentUID,
                photoURL: appointmentPhoto.photoURL,
            }).then(function(docRef) {
                appointmentPhoto.uid = docRef.id;
                resolve(appointmentPhoto);
            })
        });
    }
    
    static loadFromID(id) {
        
        var appointmentPhoto = new AppointmentPhoto();
        return new Promise(resolve => {
            firebase.firestore().collection('AppointmentPhotos').doc(id).get().then(querySnapshot => {
                if (documentSnapshot.exists) {
                    let data = documentSnapshot.data();
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
