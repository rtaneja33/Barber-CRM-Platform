import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

class CustomForm extends React.Component {
  constructor(props) {
    super(props)
  }
  submitForm() {
    var value = this.refs.personForm.getValue();
    if (value) {
      // if validation fails, value will be null
      ToastAndroid.show('Validation successful', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Please fix errors', ToastAndroid.SHORT);
    }
  }
  render() {
    let ServiceTypeModel = t.struct({
      serviceType: t.String, // a required string
    });
    return (
      <View>
       <Form
         ref='form'
         type={ServiceTypeModel}
         // options={{}}
         // value={{}}
         // onChange={{}}
       />
       <TouchableOpacity style={styles.button} onPress={this.submitForm}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  
});

export default CustomForm;