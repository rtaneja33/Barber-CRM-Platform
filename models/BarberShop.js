import { firebase } from '../src/firebase/config'

export default class BarberShop {
    
    uid = ""
    aboutDescription = ""
    address = ""
    email = ""
    shopName = ""
    baberIDs = []
    admin = ""
    services = []
    
    update() {
        var barberShopRef = firebase.firestore().collection('BarberShops').doc(this.uid);
        
        return new Promise(resolve => {
            barberShopRef.update({
                aboutDescription: this.aboutDescription,
                address: this.address,
                email: this.email,
                shopName: this.shopName,
                baberIDs: this.baberIDs,
                admin: this.admin,
                services: this.services,
            })
            resolve(true);
          });
    }
    
    static createNew(fromID = "") {
        var barberShop = new BarberShop();
        
        return new Promise(resolve => {
            
            if (fromID == "") {
                firebase.firestore().collection('BarberShops').add({
                    aboutDescription: barberShop.aboutDescription,
                    address: barberShop.address,
                    email: barberShop.email,
                    shopName: barberShop.shopName,
                    baberIDs: barberShop.baberIDs,
                    admin: barberShop.admin,
                    services: barberShop.services,
                }).then( (docRef) => {
                    barberShop.uid = docRef.id;
                    resolve(barberShop);
                })
            } else {
                firebase.firestore().collection('BarberShops').doc(fromID).set({
                    aboutDescription: barberShop.aboutDescription,
                    address: barberShop.address,
                    email: barberShop.email,
                    shopName: barberShop.shopName,
                    baberIDs: barberShop.baberIDs,
                    admin: barberShop.admin,
                    services: barberShop.services,
                })
                
                barberShop.uid = fromID;
                resolve(barberShop);
            }
        });
    }
    
    static loadFromID(id) {
        
        var barberShop = new BarberShop();
        return new Promise(resolve => {
            firebase.firestore().collection('BarberShops').doc(id).get().then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    let data = documentSnapshot.data();
                    barberShop.uid = documentSnapshot.documentID
                    barberShop.aboutDescription = data["aboutDescription"]
                    barberShop.address = data["address"]
                    barberShop.email = data["email"]
                    barberShop.shopName = data["shopName"]
                    barberShop.baberIDs = data["baberIDs"]
                    barberShop.admin = data["admin"]
                    barberShop.services = data["services"]
                    
                    resolve(barberShop);
                } else {
                    resolve(null);
                }
            });
        });
    }
}
