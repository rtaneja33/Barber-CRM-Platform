import { firebase } from '../src/firebase/config'

export default class Appointment {
    
    uid = ""
    barberUID = ""
    customerPhoneNumber = ""
    appointmentFrontPhotoUID = ""
    appointmentSidePhotoUID = ""
    appointmentRearPhotoUID = ""
    notes = ""
    shopName = ""
    timestamp = ""

    serviceProvided = []
    approvedByCustomer = false
    privateNotes = false
    
    verifyPhoneNumber() {
        this.customerPhoneNumber = this.customerPhoneNumber.replace(/\D/g,'');
    }
    
    update() {
        this.verifyPhoneNumber()
        
        var appointmentRef = firebase.firestore().collection('Appointments').doc(this.uid);
        
        return new Promise(resolve => {
            appointmentRef.update({
                barberUID: this.barberUID,
                shopName: this.shopName, 
                customerPhoneNumber: this.customerPhoneNumber,
                appointmentFrontPhotoUID: this.appointmentFrontPhotoUID,
                appointmentSidePhotoUID: this.appointmentSidePhotoUID,
                appointmentRearPhotoUID: this.appointmentRearPhotoUID,
                notes: this.notes,
                timestamp: this.timestamp,
                serviceProvided: this.serviceProvided,
                approvedByCustomer: this.approvedByCustomer,
                privateNotes: this.privateNotes
            })
            resolve(true);
        });
    }
    
    static createNew(fromID = "") {
        var appointment = new Appointment();
        
        return new Promise(resolve => {
            if (fromID == "") {
                firebase.firestore().collection('Appointments').add({
                    barberUID: appointment.barberUID,
                    shopName: appointment.shopName, 
                    customerPhoneNumber: appointment.customerPhoneNumber,
                    appointmentFrontPhotoUID: appointment.appointmentFrontPhotoUID,
                    appointmentSidePhotoUID: appointment.appointmentSidePhotoUID,
                    appointmentRearPhotoUID: appointment.appointmentRearPhotoUID,
                    notes: appointment.notes,
                    timestamp: appointment.timestamp,
                    serviceProvided: appointment.serviceProvided,
                    approvedByCustomer: appointment.approvedByCustomer,
                    privateNotes: appointment.privateNotes,
                }).then(function(docRef) {
                    appointment.uid = docRef.id;
                    resolve(appointment);
                })
            } else {
                firebase.firestore().collection('Appointments').doc(fromID).set({
                    barberUID: appointment.barberUID,
                    shopName: appointment.shopName, 
                    customerPhoneNumber: appointment.customerPhoneNumber,
                    appointmentFrontPhotoUID: appointment.appointmentFrontPhotoUID,
                    appointmentSidePhotoUID: appointment.appointmentSidePhotoUID,
                    appointmentRearPhotoUID: appointment.appointmentRearPhotoUID,
                    notes: appointment.notes,
                    serviceProvided: appointment.serviceProvided,
                    approvedByCustomer: appointment.approvedByCustomer,
                    privateNotes: appointment.privateNotes,
                })
                
                appointment.uid = fromID;
                resolve(appointment);
            }
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
                    appointment.shopName = data["shopName"]
                    appointment.customerPhoneNumber = data["customerPhoneNumber"]
                    appointment.appointmentFrontPhotoUID = data["appointmentFrontPhotoUID"]
                    appointment.appointmentSidePhotoUID = data["appointmentSidePhotoUID"]
                    appointment.appointmentRearPhotoUID = data["appointmentRearPhotoUID"]
                    appointment.notes = data["notes"]
                    appointment.timestamp = data["timestamp"]
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
