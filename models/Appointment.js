import { firebase } from '../src/firebase/config'

export default class Appointment {
    
    uid = ""
    barberUID = ""
    customerUID = ""
    appointmentUID = ""
    notes = ""
    serviceProvided = ""
    approvedByCustomer = false
    privateNotes = false
    
    update() {
        var appointmentRef = firebase.firestore().collection('Appointments').doc(this.uid);
        
        return new Promise(resolve => {
            appointmentRef.update({
                barberUID: barberUID,
                customerUID: customerUID,
                appointmentUID: appointmentUID,
                notes: notes,
                serviceProvided: serviceProvided,
                approvedByCustomer: approvedByCustomer,
                privateNotes: privateNotes
            })
            resolve(true);
          });
    }
    
    static createNew() {
        var appointment = new Appointment();
        
        return new Promise(resolve => {
            firebase.firestore().collection('Appointments').add({
                barberUID: appointment.barberUID,
                customerUID: appointment.customerUID,
                appointmentUID: appointment.appointmentUID,
                notes: appointment.notes,
                serviceProvided: appointment.serviceProvided,
                approvedByCustomer: appointment.approvedByCustomer,
                privateNotes: appointment.privateNotes,
            }).then(function(docRef) {
                appointment.uid = docRef.id;
                resolve(appointment);
            })
        });
    }
    
    static loadFromID(id) {
        
        var appointment = new Appointment();
        return new Promise(resolve => {
            firebase.firestore().collection('Appointments').doc(id).get().then(querySnapshot => {
                if (documentSnapshot.exists) {
                    let data = documentSnapshot.data();
                    appointment.uid = documentSnapshot.documentID
                    appointment.barberUID = data["barberUID"]
                    appointment.customerUID = data["customerUID"]
                    appointment.appointmentUID = data["appointmentUID"]
                    appointment.notes = data["notes"]
                    appointment.serviceProvided = data["serviceProvided"]
                    appointment.approvedByCustomer = data["approvedByCustomer"]
                    appointment.privateNotes = data["privateNotes"]
                    
                    resolve(appointment);
                } else {
                    resolve(null);
                }
            });
            
        });
    }
}
