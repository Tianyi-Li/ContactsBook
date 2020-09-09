import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
} from "react-native";

const TextInfo = (props) => {
  [dataForDatabase, setDataForDatabase] = useState({});
  [isconfirm, setisconfirm] = useState(false);
  
  onFirstNameChangeHandler = (value) => {
    setDataForDatabase((prevState) => ({ ...prevState, firstName: value }));
    setDataForDatabase((prevState) => ({ ...prevState, picture: props.onImg }));
  };
  onFinish = () => {
    props.onFinish();
  };

  onLastNameChangeHandler = (value) => {
    setDataForDatabase((prevState) => ({ ...prevState, lastName: value }));
  };

  onEmailChangeHandler = (value) => {
    setDataForDatabase((prevState) => ({ ...prevState, email: value }));
  };

  onMobileChangeHandler = (value) => {
    setDataForDatabase((prevState) => ({ ...prevState, mobile: value }));
  };

  saveToFile = () => {
    props.emitAllInfo(dataForDatabase);
    setisconfirm(true);
  };

  return (
    <View style={styles.form}>
      <View style={styles.formName}>
        <View style={styles.inputWrap}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onFirstNameChangeHandler}
            placeholder="First Name"
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onLastNameChangeHandler}
            placeholder="Last Name"
          />
        </View>
      </View>
      <View style={styles.formName1}>
        <TextInput
          style={styles.textInput}
          onChangeText={onEmailChangeHandler}
          placeholder="Email"
        />

        <TextInput
          style={styles.textInput}
          onChangeText={onMobileChangeHandler}
          placeholder="Mobile"
        />
      </View>
      <View style={{ marginTop: 7 }}>
        <View style={styles.buttonClearContainer}>
          <Button title="Back" onPress={() => onFinish()}></Button>

          <Button
            title="Confirm"
            onPress={saveToFile}
            disabled={isconfirm}
          ></Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    margin: 20,
  },
  formName: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    maxHeight: 85,
  },
  formName1: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    maxHeight: 85,
    paddingBottom: 5,
    paddingLeft: 5,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "column",
    margin: 4,
    height: 88,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 5,
    paddingVertical: 4,
    paddingHorizontal: 2,
    textAlignVertical: "top",
    width: "98%",
    marginLeft: 4,
  },
  buttonClearContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 5,
  },
});

export default TextInfo;
