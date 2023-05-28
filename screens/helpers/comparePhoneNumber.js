export function comparePhoneNumber(phoneNumber) {
    var phoneNum = phoneNumber.replace(/\D/g,'');
    if(phoneNum.length > 10)
        return phoneNum.slice(1);
    else
        return phoneNum;
  }