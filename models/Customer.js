import { firebase } from '../src/firebase/config'

export default class Customer {
    
    uid = ""
    name = ""
    phonenumber = ""
    appointmentHistory = []
    
    verifyPhoneNumber() {
        this.phonenumber = this.phonenumber.replace(/\D/g,'');
    }
    
    update() {
        this.verifyPhoneNumber()
        
        var customerRef = firebase.firestore().collection('Customers').doc(this.uid);
        return new Promise(resolve => {
            customerRef.update({
                name: this.name,
                phonenumber: this.phonenumber,
                appointmentHistory: this.appointmentHistory,
            })
            resolve(true);
          });
    }
    
    static createNew(fromID = "") {
        var customer = new Customer();
        
        return new Promise(resolve => {
            
            if (fromID == "") {
                firebase.firestore().collection('Customers').add({
                    name: customer.name,
                    phonenumber: customer.phonenumber,
                    appointmentHistory: customer.appointmentHistory,
                }).then( (docRef) => {
                    customer.uid = docRef.id;
                    resolve(customer);
                })
            } else {
                firebase.firestore().collection('Customers').doc(fromID).set({
                    name: customer.name,
                    phonenumber: customer.phonenumber,
                    appointmentHistory: customer.appointmentHistory,
                })
                
                customer.uid = fromID;
                resolve(customer);
            }
        });
    }
    
    static loadFromID(id) {
        var customer = new Customer();
        return new Promise(resolve => {
            firebase.firestore().collection('Customers').doc(id).get().then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    let data = documentSnapshot.data();
                    customer.uid = id
                    customer.name = data["name"]
                    customer.phonenumber = data["phonenumber"]
                    customer.appointmentHistory = data["appointmentHistory"]
                    
                    resolve(customer);
                } else {
                    resolve(null);
                }
            });
        });
    }
}
