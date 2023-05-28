import { firebase } from '../src/firebase/config'

export default class CustomerPreview {
    
    uid = ""
    firstName = ""
    lastName = ""
    name = ""
    phonenumber = ""
    
    verifyPhoneNumber() {
        this.phonenumber = this.phonenumber.replace(/\D/g,'');
    }
    
    update() {
        this.verifyPhoneNumber()
        var customerRef = firebase.firestore().collection('CustomerPreview').doc(this.uid);
        return new Promise(resolve => {
            customerRef.update({
                firstName: this.firstName,
                lastName: this.lastName,
                name: this.name,
                phonenumber: this.phonenumber,
            })
            resolve(true);
          });
    }
    
    static createNew(fromID = "") {
        var customerPreview = new CustomerPreview();
        
        return new Promise(resolve => {
            if (fromID == "") {
                firebase.firestore().collection('CustomerPreview').add({
                    firstName: customerPreview.firstName,
                    lastName:  customerPreview.lastName,
                    name:  customerPreview.name,
                    phonenumber:  customerPreview.phonenumber,
                }).then( (docRef) => {
                    customerPreview.uid =  customerPreview.id;
                    resolve(customer);
                })
            } else {
                firebase.firestore().collection('CustomerPreview').doc(fromID).set({
                    firstName: customerPreview.firstName,
                    lastName:  customerPreview.lastName,
                    name:  customerPreview.name,
                    phonenumber:  customerPreview.phonenumber,
                })
                
                customerPreview.uid = fromID;
                resolve(customer);
            }
        });
    }
    
    static loadFromID(id) {
        var customerPreview = new CustomerPreview();
        return new Promise(resolve => {
            firebase.firestore().collection('CustomerPreview').doc(id).get().then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    let data = documentSnapshot.data();
                    customerPreview.uid = id
                    customerPreview.firstName = data["firstName"]
                    customerPreview.lastName = data["lastName"]
                    customerPreview.name = data["name"]
                    customerPreview.phonenumber = data["phonenumber"]
                    resolve(customerPreview);
                } else {
                    resolve(null);
                }
            });
        });
    }
}
