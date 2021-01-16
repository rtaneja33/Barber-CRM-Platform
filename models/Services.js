import { firebase } from '../src/firebase/config'

export default class Services {
    
    uid = ""
    serviceName = ""
    price = 0
    
    update() {
        var servicesRef = firebase.firestore().collection('Services').doc(this.uid);
        
        return new Promise(resolve => {
            servicesRef.update({
                barberUID: this.barberUID,
                appointmentUID: this.appointmentUID,
            })
            resolve(true);
        });
    }
    
    static createNew(fromID = "") {
        var services = new Services();
        
        return new Promise(resolve => {
            if (fromID == "") {
                firebase.firestore().collection('Services').add({
                    barberUID: services.barberUID,
                    appointmentUID: services.appointmentUID,
                    photoURL: services.photoURL,
                }).then(function(docRef) {
                    services.uid = docRef.id;
                    resolve(services);
                })
            } else {
                firebase.firestore().collection('Services').doc(fromID).set({
                    barberUID: services.barberUID,
                    appointmentUID: services.appointmentUID,
                    photoURL: services.photoURL,
                })
                
                services.uid = fromID;
                resolve(services);
            }
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
