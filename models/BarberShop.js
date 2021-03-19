import { firebase } from '../src/firebase/config'

export default class BarberShop {
    
    uid = ""
    aboutDescription = ""
    address = ""
    email = ""
    shopName = ""
    barberIDs = []
    admin = ""
    services = {}
    
    update() {
        var barberShopRef = firebase.firestore().collection('BarberShops').doc(this.uid);
        return new Promise(resolve => {
            barberShopRef.update({
                aboutDescription: this.aboutDescription,
                address: this.address,
                email: this.email,
                shopName: this.shopName,
                barberIDs: this.barberIDs,
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
                    barberIDs: barberShop.barberIDs,
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
                    barberIDs: barberShop.barberIDs,
                    admin: barberShop.admin,
                    services: barberShop.services,
                })
                
                barberShop.uid = fromID;
                resolve(barberShop);
            }
        });
    }

    updateAboutDescription(description) {
        this.aboutDescription = description
        // this.update();
        return new Promise((resolve, reject) => {
            this.update().then(success => {
                resolve(success);
            })
            .catch((err)=> {
                console.log("error updating about description", err);
                reject(err);
            })
        })
    }
    
    deleteServiceItem(serviceCategory, serviceIndex) { 
        this.services.filter((obj, ind) => {
            if (obj.serviceType === serviceCategory) {
                console.log("DELETING obj", obj, "at index", ind)
                obj.services.splice(serviceIndex, 1);
            }
          });
        // this.update();
        return new Promise((resolve, reject) => {
            this.update().then(success => {
                resolve(success);
            })
            .catch((err)=> {
                console.log("error deleting service item:", err);
                reject(err);
            })
        })
    }

    updateServiceItem(serviceCategory, serviceIndex, newServiceObject) { 
        // console.log("in service item update method now")
        // console.log("IN BARBERSHOP API, received serviceCategory of", serviceCategory, "serviceIndex of", serviceIndex,"serviceObject of", newServiceObject);
        // console.log("IN BARBERSHOP METHOD, this.sercices is", this.services)
        // console.log("this.services[servicecategory[",this.services[serviceCategory]);
        this.services.map((obj) => {
            if(obj.serviceType === serviceCategory){
                obj.services[serviceIndex] = {...newServiceObject};
            }
        })
        // this.update();
        return new Promise((resolve, reject) => {
            this.update().then(success => {
                resolve(success);
            })
            .catch((err)=> {
                console.log("error updating:", err);
                reject(err);
            })
        })
    }
    addServiceItem(serviceCategory, serviceItem) {
        this.services.map((obj, ind)=>{
            if(obj.serviceType === serviceCategory){
                obj.services.push(serviceItem);
            }
        })
        return new Promise((resolve, reject) => {
            this.update().then(success => {
                resolve(success);
            })
            .catch((err)=> {
                console.log("error adding service item:", err);
                reject(err);
            })
        })
    }

    addServiceCategory(newServiceCategory) {
        this.services.push(newServiceCategory);
        return new Promise((resolve, reject) => {
            this.update().then(success => {
                resolve(success);
            })
            .catch((err)=> {
                console.log("error adding cat:", err);
                reject(err);
            })
        })
    }

    deleteServiceCategory(oldKey) { 
        //delete this.services[oldKey];
        this.services = this.services.filter((obj) => {
            return obj.serviceType !== oldKey
          });
        // this.update();
        return new Promise((resolve, reject) => {
            this.update().then(success => {
                resolve(success);
            })
            .catch((err)=> {
                console.log("error deleting:", err);
                reject(err);
            })
        })
    }

   updateServiceCategory(oldKey, updatedKey) { 
        //console.log("IN BARBERSHOP API - updateServiceCategory, received oldKey of", oldKey, "oldObjectWithoutKey of", oldObjectWithoutKey,"updatedKey of", updatedKey);
        this.services[updatedKey] = this.services[oldKey];
        this.services.map((obj)=>{
            if(obj.serviceType === oldKey){
                obj.serviceType = updatedKey;
            }
        })
        this.update();
        return new Promise((resolve, reject) => {
            this.update().then(success => {
                resolve(success);
            })
            .catch((err)=> {
                console.log("error updating:", err);
                reject(err);
            })
        })
    }
    
    static loadFromID(id) {
        var barberShop = new BarberShop();
        return new Promise(resolve => {
            firebase.firestore().collection('BarberShops').doc(id).get().then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    let data = documentSnapshot.data();
                    barberShop.uid = id
                    barberShop.aboutDescription = data["aboutDescription"]
                    barberShop.address = data["address"]
                    barberShop.email = data["email"]
                    barberShop.shopName = data["shopName"]
                    barberShop.barberIDs = data["barberIDs"]
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
