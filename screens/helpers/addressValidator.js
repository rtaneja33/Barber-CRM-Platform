import { firebase } from '../../src/firebase/config'

export async function addressValidatorFAKE(barberShop) {
    try {
        barberShop.validateLatLongFromAddress().then((hello)=>{
            console.log("hello is", hello)
        })
        console.log('barberShop is, after validation', barberShop);
        return 'worked?'
        
        
    }
    catch (error){
        console.log("error with address", error)
        return 'error occurred with address'
    }
    // if (!password) return "Password can't be empty."
    // if (password.length < 5) return 'Password must be at least 5 characters long.'
    return ''
}

export function addressValidator(address) {
    return firebase.firestore().collection("Global").doc("AccessTokens").get().then(documentSnapshot => {
        console.log('start of validation')
        let data = documentSnapshot.data();
        let accesstoken = data["mapbox"];
        let encodedAddress = encodeURIComponent(address.trim());
        let request = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodedAddress + ".json?types=address&access_token=" + accesstoken;
        return new Promise((resolve, reject) => {
            fetch(request).then((response) => response.json()).then((json) => {
                let longitude = json.features[0].center[0];
                let latitude = json.features[0].center[1];
                if(longitude == 0 || latitude == 0){
                    resolve('Please enter a valid street address.')
                }
                resolve(null)
            })
            .catch((err)=> {
                if (!address.trim()) 
                    resolve("Address can't be empty.")
                resolve('Please enter a valid street address.')
            }) 
        })

        
        
    })
}

