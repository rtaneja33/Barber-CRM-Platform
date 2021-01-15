import { firebase } from '../src/firebase/config'

class Services {
    
    uid = ""
    serviceName = ""
    price = 0
    
    update() {
        var servicesRef = firebase.firestore().collection('Services').doc(uid);
        
        return new Promise(resolve => {
            servicesRef.update({
                barberUID: barberUID,
                appointmentUID: appointmentUID,
            })
            resolve(true);
        });
    }
    
    static createNew() {
        var services = new Services();
        
        return new Promise(resolve => {
            firebase.firestore().collection('Services').add({
                barberUID: services.barberUID,
                appointmentUID: services.appointmentUID,
                photoURL: services.photoURL,
            }).then(function(docRef) {
                services.uid = docRef.id;
                resolve(services);
            })
        });
    }
    
    static loadFromID(id) {
        var services = new Services();
        return new Promise(resolve => {
            firebase.firestore().collection('Services').doc(id).get().then(querySnapshot => {
                if (documentSnapshot.exists) {
                    let data = documentSnapshot.data();
                    services.uid = documentSnapshot.documentID
                    services.barberUID = data["barberUID"]
                    services.appointmentUID = data["appointmentUID"]
                    services.photoURL = data["photoURL"]
                    
                    resolve(services);
                } else {
                    resolve(null);
                }
            });
        });
    }
}
