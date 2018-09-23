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
         onRequestClose={ () => console.log('closed add') }>>
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

export default DisplayCreateChecklistModal;