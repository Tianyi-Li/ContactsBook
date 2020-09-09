import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Button,
  Alert,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Image
} from "react-native";
import { db, auth } from "../FirebaseConfig";
import call from "react-native-phone-call";
import ImageSelector from "./ImageSelector";
import TextInfo from "./TextInfo";
import * as MailComposer from "expo-mail-composer";
import * as SMS from 'expo-sms';
import logo from "./logo.png"
const Homepage = () => {


  [registrationEmail, setRegistrationEmail] = useState("");
  [registrationPassword, setRegistrationPassword] = useState("");
  [loginEmail, setLoginEmail] = useState("");
  [loginPassword, setLoginPassword] = useState("");
  [mainScreen, setmainScreen] = useState(false);
  [loggedIn, setLoggedIn] = useState(false);
  [Reginster, setReginster] = useState(false);
  [editingContact, setEditingContact] = useState(false);
  [completedUserInfo, setCompletedUserInfo] = useState(false);
  [databaseData, setDatabaseData] = useState("");
  [tempName, setTempName] = useState("");
  [tempEmail, setTempEmail] = useState("");
  [tempPhoneNo, setTempPhoneNo] = useState("");
  const [listSelected, setListSelected] = useState(false);
  const [Information, setInformation] = useState({
    name: "",
    phoneNo: "",
    email: "",
  });
  const [Data, setData] = useState([
    {
      name: "Tianyi Li",
      phoneNo: "987654321",
      email: "abc@bbb.com",
    },
    {
      name: "Victoria",
      phoneNo: "123456789",
      email: "abc@aaa.com",
    },
    {
      name: "Mike",
      phoneNo: "123456789",
      email: "abc@aaa.com",
    }
  ]);

  const [imgUri, setimageUri] = useState();
  const [allinfo, setallinfo] = useState();
  const [notConfirm, setnotconfirm] = useState(true);

  function saveDataWithFirebase() {

    var userId = auth.currentUser.uid;
    // SAVE DATA TO REALTIME DB
    db.ref("users/" + userId)
      .set({
        firstName: allinfo.firstName,
        lastName: allinfo.lastName,
        email: allinfo.email,
        mobile: allinfo.mobile,
        picture: allinfo.picture,
      })
      .then(function () {
        Alert.alert("Upload to Cloud!");
      })
      .catch(function (error) {
        Alert.alert("Error writing document");
        console.log("Error writing document: ", error);
      });

    setCompletedUserInfo(false);

  }

  registerWithFirebase = () => {
    if (registrationEmail.length < 4) {
      Alert.alert("Please enter an email address.");
      return;
    }

    if (registrationPassword.length < 4) {
      Alert.alert("Please enter a password.");
      return;
    }

    auth
      .createUserWithEmailAndPassword(registrationEmail, registrationPassword)
      .then(function (_firebaseUser) {
        Alert.alert("user registered!");

        setRegistrationEmail("");
        setRegistrationPassword("");
        setReginster(false);
        setLoggedIn(false);
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == "auth/weak-password") {
          Alert.alert("The password is too weak.");
        } else {
          Alert.alert(errorMessage);
        }
        console.log(error);
      });
  };
  const makeAPohoneCall = (phoneNo) => {
    var number = {
      number: phoneNo, // Use commas to add time between digits.
      prompt: false,
    };
    call(number).catch(console.error);
  };
  const editContact = () => {
    setEditingContact(true);
    setTempName(Information.name);
    setTempEmail(Information.email);
    setTempPhoneNo(Information.phoneNo);
  };

  const editTheContact = () => {
    var name = tempName;
    Alert.alert(name === "" ? `new contact added'` : `${name}'s data edited'`);
    var tempList = [];
    for (var x = 0; x < Data.length; x++) {
      if (name === "") {
        tempList.push(Information);
        name = "aaa";
      }
      if (Data[x].name !== name) {
        tempList.push(Data[x]);
      } else {
        tempList.push(Information);
      }
    }
    setData(tempList);
    setEditingContact(false);
  };

  const onNameChange = (value) => {
    var temp = {
      name: `${value}`,
      phoneNo: `${Information.phoneNo}`,
      email: `${Information.email}`,
    };
    setInformation(temp);
  };

  const onMobileChange = (value) => {
    var temp = {
      name: `${Information.name}`,
      phoneNo: `${value}`,
      email: `${Information.email}`,
    };
    setInformation(temp);
  };

  const onEmailChange = (value) => {
    var temp = {
      name: `${Information.name}`,
      phoneNo: `${Information.phoneNo}`,
      email: `${value}`,
    };
    setInformation(temp);
  };
  const deleteSeleted = () => {
    var name = Information.name;
    Alert.alert(`${name} is deleted!`);
    var tempList = [];
    for (var x = 0; x < Data.length; x++) {
      if (Data[x].name !== name) {
        tempList.push(Data[x]);
      }
    }
    setData(tempList);
    setInformation({
      name: "",
      phoneNo: "",
      email: "",
    });
    setListSelected(false);
  };
  const bakeToList = () => {
    setInformation({
      name: "",
      phoneNo: "",
      email: "",
    });
    setListSelected(false);
  };
  const sendMessageWithSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        [`${Information.phoneNo}`],
        ''
      );
      console.log(result);
    } else {
      console.log("SMS is not available on this device");
    }
  }

  const sendAnEmail = (email) => {
    var options = {
      // recipients (array) -- An array of e-mail addressess of the recipients.
      recipients: [email],
      // ccRecipients (array) -- An array of e-mail addressess of the CC recipients.
      // bccRecipients (array) -- An array of e-mail addressess of the BCC recipients.
      // subject (string) -- Subject of the mail.
      subject: "My Subject Line",
      // body (string) -- Body of the mail.
      body: "",
    };

    MailComposer.composeAsync(options).then((result) => {
      console.log(result.status);
    });
  };
  const emailOrCall = () => {
    var item = Information;
    Alert.alert(
      `${item.name}`,
      `PhoneNo: ${item.phoneNo} \nEmail: ${item.email}`,
      [
        { text: "Close", onPress: () => console.log("Close Pressed") },
        {
          text: `email ${item.name}`,
          onPress: () => sendAnEmail(item.email),
        },
        {
          text: `SMS ${item.name}`,
          onPress: () => sendMessageWithSMS(),
        },
      ],
      { cancelable: false }
    );
  };

  const onUserSelected = (item) => {
    setListSelected(true);
    setInformation(item);
  };

  function Item({ item }) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onUserSelected(item)}
      >
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
    );
  }
  const imageHandler = (imgUri) => {
    setimageUri(imgUri);
  };
  const allInfo = (allInfo) => {
    // setimageUri(allInfo);
    setallinfo(allInfo);
    setnotconfirm(false);
  };

  
  backToLogin = () => {
    setReginster(false);
    setLoggedIn(false);
  };
  registerWithNewAccount = () => {
    setReginster(true);
    setLoggedIn(true);
  };

  loginWithFirebase = () => {
    if (loginEmail.length < 4) {
      Alert.alert("Please enter an email address.");
      return;
    }

    if (loginPassword.length < 4) {
      Alert.alert("Please enter a password.");
      return;
    }

    auth
      .signInWithEmailAndPassword(loginEmail, loginPassword)
      .then(function (_firebaseUser) {
        Alert.alert("Logged In!");
        setLoggedIn(true);
        setmainScreen(true);

        // load data
        //retrieveDataFromFirebase();
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === "auth/wrong-password") {
          Alert.alert("Wrong password.");
        } else {
          Alert.alert(errorMessage);
        }
      });
  };

  signoutWithFirebase = () => {
    auth.signOut().then(function () {
      // if logout was successful
      if (!auth.currentUser) {
        Alert.alert("user was logged out!");
        setLoggedIn(false);
        setmainScreen(false);
      }
    });
  };
  addNewContect = () => {
    setInformation({
      name: "",
      phoneNo: "",
      email: "",
    });
    editContact();
  };




  return (
    <View style={styles.form}>
      {Reginster && (
        <View>
          <View>
            <Text style={styles.label}>Register</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(value) => setRegistrationEmail(value)}
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="email"
              keyboardType="email-address"
              placeholder="email"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={(value) => setRegistrationPassword(value)}
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="password"
              // keyboardType="visible-password"
              placeholder="password"
              secureTextEntry={true}
            />
            <View style={styles.buttonContainer}>
              <Button
                style={styles.button}
                title="          Go Back         "
                onPress={backToLogin}
              />
              <Button
                style={styles.button}
                title="         Register         "
                onPress={registerWithFirebase}
              />
            </View>
          </View>
        </View>
      )}
      {!loggedIn && (
        <View>
          <View>
            <Text style={styles.label}>Sign In</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(value) => setLoginEmail(value)}
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="email"
              keyboardType="email-address"
              placeholder="email"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={(value) => setLoginPassword(value)}
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="password"
              // keyboardType="visible-password"
              placeholder="password"
              secureTextEntry={true}
            />
            <View style={styles.buttonContainer}>
              <Button
                style={styles.button}
                title="          Login           "
                onPress={loginWithFirebase}
              />
              <Button
                style={styles.button}
                title="         Register         "
                onPress={registerWithNewAccount}
              />
            </View>
          </View>
        </View>
      )}

      {mainScreen && (
        <View style={styles.container}>
          <View style={styles.headers}>
           <Image source={logo} style={{ width: 50, height: 50}}></Image>
            <Text style={styles.H1}>Contacts</Text>
          </View>
          <View>
            <Button
              title="Complete Your Account Info"
              onPress={() => setCompletedUserInfo(true)}
            />
          </View>
          <View style={{marginTop: 3}}>
            <Button title="Add new contact" onPress={() => addNewContect()} />
          </View>
          {/* <View style={styles.headers}>
            <Text style={styles.H2}>Contact List</Text>
          </View> */}
          <View style={{marginTop:10}}>
            <FlatList
              data={Data}
              renderItem={({ item }) => <Item item={item} />}
              keyExtractor={(item) => item.name}
            />
          </View>
         
        </View>
      )}
      <Modal visible={listSelected} animationType="slide">
        <View style={styles.headers}>
          <Text style={styles.H2}>{Information.name}</Text>
        </View>
        <View style={styles.content}>
          <Button title="See/Edit Detail" onPress={() => editContact()} />
        </View>
        <View style={styles.content}>
          <Button title="Call" onPress={() => makeAPohoneCall(Information.phoneNo)} />
        </View>
        <View style={styles.content}>
          <Button title="Email/SMS" onPress={() => emailOrCall()} />
        </View>
        <View style={styles.content}>
          <Button title="Delete" onPress={() => deleteSeleted()} />
        </View>
        <View style={styles.content}>
          <Button title="Back" onPress={() => bakeToList()} />
        </View>
      </Modal>
      <Modal visible={completedUserInfo} animationType="slide">
        <ImageSelector onImageSelected={imageHandler} />
        <TextInfo
          onImg={imgUri}
          emitAllInfo={allInfo}
          onFinish={() => setCompletedUserInfo(false)}
        />
        <Button
          style={styles.button}
          title="Save to Cloud"
          onPress={saveDataWithFirebase}
          disabled={notConfirm}
        />
      </Modal>

      <Modal visible={editingContact} animationType="slide">
        <View style={styles.form}>
          <View style={styles.formName}>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Name : {tempName}</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={onNameChange}
                placeholder="name"
              />
            </View>
          </View>
          <Text style={styles.label}>Email : {tempEmail}</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onEmailChange}
            placeholder="email"
          />
          <Text style={styles.label}>phoneNo : {tempPhoneNo}</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onMobileChange}
            placeholder="phoneNo"
          />
          <View style={styles.buttonClearContainer}>
            <Button title="Save" onPress={() => editTheContact()}></Button>
          </View>
          <View style={styles.buttonClearContainer}>
            <Button
              title="Back"
              onPress={() => setEditingContact(false)}
            ></Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    margin: 30,
    marginTop: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2,
    textAlignVertical: "top",
  },
  buttonContainer: {
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    width: "40%",
  },
  signOutButton: {
    paddingVertical: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  H1: {
    fontSize: 40,
    fontWeight: "bold",
  },
  H2: {
    fontSize: 30,
  },
  headers: {
    paddingBottom: 20,
    alignItems: "center",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  name: {
    fontSize: 32,
  },
  buttonClearContainer: {
    marginTop: 2
  },
  content: {
    marginBottom: 6
  }
});
export default Homepage;
