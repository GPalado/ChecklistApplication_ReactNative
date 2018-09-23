import React from 'react'
import { Modal, View, Image, Text, StyleSheet, Button } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements';

import t from 'tcomb-form-native';

const Form = t.form.Form;

const Checklist = t.struct({
    name: t.String,
    description: t.String
});

const DisplayCreateChecklistModal = (props) => (
  <Modal visible={ props.displayAdd } animationType = "slide"
         onRequestClose={ () => console.log('closed add')} style={modalStyles.modal}>
    <View>
        <Form type={Checklist} />
        <Button
            title="Save"
            onPress={this.saveChecklist}
        />
    </View>
  </Modal>
)

saveChecklist = () => {
    const checklist = this._form.getValue();
    console.log('New checklist ', checklist);
}

const modalStyles = StyleSheet.create({
  modal: {
    marginTop: 20,
    marginLeft: 90,
    height: 200,
    width: 200
  },
});

export default DisplayCreateChecklistModal;