import { firebase } from '../src/firebase/config';
import BarberShops from '../models/BarberShop';
import { Service } from '../constants';
export default class Services {
    shopUID = ""
    serviceName = ""
    price = 0
    
    update() {
        var servicesRef = firebase.firestore().collection('Services').doc(this.uid);
        
        return new Promise(resolve => {
            servicesRef.update({
                serviceName: this.serviceName,
                price: this.price,
            })
            resolve(true);
        });
    }

    
    static createNew(serviceCategory, serviceObj) {
        const uid = firebase.auth().currentUser.uid;
        return new Promise(resolve => {
            BarberShops.loadFromID(uid)
                .then((barberShopRef) => {
                    barberShopRef.services[serviceCategory] = serviceObj;
                    barberShopRef.update()
                    resolve(serviceObj)
                })
        });
    }
    
    // static loadServices(id) {
    //     var services = new Services();
    //     return new Promise(resolve => {
    //         firebase.firestore().collection('Services').doc(id).get().then(documentSnapshot => {
    //             if (documentSnapshot.exists) {
    //                 let data = documentSnapshot.data();
    //                 services.uid = documentSnapshot.documentID
    //                 services.shopUID = data["shopUID"]
    //                 services.serviceName = data["serviceName"]
    //                 services.price = data["price"]
                    
    //                 resolve(services);
    //             } else {
    //                 resolve(null);
    //             }
    //         });
    //     });
    // }
}
