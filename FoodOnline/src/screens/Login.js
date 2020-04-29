import React, { Component } from 'react'
import {
    Text,
    Button,
    View,
    Easing,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image
} from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import {
    createStackNavigator,
    CardStyleInterpolators
} from '@react-navigation/stack'

import auth from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"

import { string } from '../strings/en'

import ChooseGender from './ChooseGender'
import Home from './Home'

import Modal from 'react-native-modalbox'


class InputField extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            isSignIn: true
        }
    }

    switchToOther = () => {
        this.state.isSignIn ? (
            this.setState({ isSignIn: false })
        ) : (
                this.setState({ isSignIn: true })
            )
    }

    SignIn = (email, password) => {
        email !== "" && password !== "" ? (
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    const uid = auth().currentUser.uid
                    database()
                        .ref(`Users/${uid}/`)
                        .on("value", snapshot => {
                            snapshot.val().isRegisterComplete === "true" ? this.props.navigation.navigate("Home") : this.props.navigation.navigate("ChooseGender")
                        })
                })
                .catch(err => alert(err))
        ) : (this.refs.signModal.open())

    }

    SignUp = (email, password) => {
        email !== "" & password !== "" ? (
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                    this.writeDataToFB(email, password)
                    this.props.navigation.navigate("ChooseGender")
                })
                .catch(err => alert(err))) : this.refs.signModal.open()
    }

    writeDataToFB(email, password) {
        const uid = auth().currentUser.uid;
        const ref = database().ref(`Users/${uid}`);
        ref.set({
            email: email,
            password: password,
            isRegisterComplete: 'false',
        })
    }

    render() {
        const { email, password, isSignIn } = this.state

        return (
            <View style={styles.container}>
                <View style={styles.imageHeader}>
                    <Image
                        source={require("../assets/img/bowlOfPho.png")}
                        style={{ width: 400, height: 400, }}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{string.hungry}</Text>
                </View>

                <View style={{ height: 170 }} />

                <View style={{}}>
                    <TextInput
                        placeholder={string.email}
                        style={styles.input}
                        onChangeText={email => this.setState({ email })}
                        value={email}
                        keyboardType="email-address"
                    />
                    <TextInput
                        placeholder={string.password}
                        style={[styles.input, { marginTop: 15 }]}
                        onChangeText={password => this.setState({ password })}
                        value={password}
                        secureTextEntry={true}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ justifyContent: "center", left: 45 }}>
                            <TouchableOpacity
                                onPress={this.switchToOther}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Sofia",
                                        fontSize: 35
                                    }}>{isSignIn ? string.signIn : string.signUp}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ right: 45 }}>
                            {
                                isSignIn ? (
                                    <TouchableOpacity
                                        style={styles.submitButton}
                                        onPress={() => this.SignIn(email, password)}
                                    >
                                        <Image
                                            source={require("../assets/img/bowlIcon.png")}
                                            style={styles.bowlIcon}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
                                ) : (
                                        <TouchableOpacity
                                            style={styles.submitButton}
                                            onPress={() => this.SignUp(email, password)}
                                        >
                                            <Image
                                                source={require("../assets/img/bowlIcon.png")}
                                                style={styles.bowlIcon}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>
                                    )
                            }
                        </View>
                    </View>

                    <View style={{ left: 45 }}>
                        <TouchableOpacity
                            onPress={this.switchToOther}
                        >
                            <Text style={{ fontFamily: "Sofia", fontSize: 14, color: "grey" }}>{isSignIn ? string.signUp : string.signIn}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                < Modal style={{
                    width: "50%",
                    height: "25%",
                    borderRadius: 10,
                    alignItems: "center"
                }}
                    position={"center"}
                    ref={"signModal"}
                    swipeToClose={false}
                    backdropColor="grey"
                    animationDuration={300}
                    backButtonClose={true}
                >
                    <View style={{ width: 70, height: 70, backgroundColor: "black", borderRadius: 35, top: -35, justifyContent: "center", alignItems: "center" }}>
                        <Image
                            source={require("../assets/img/emptybowl.png")}
                            style={{ width: 30, height: 30 }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={{ alignItems: "center", marginLeft: 25, marginRight: 25, marginBottom: 25 }}>
                        <Text style={{ fontFamily: "Sofia", textAlign: "center" }}> {string.fill} </Text>
                    </View>
                </Modal>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    imageHeader: {
        position: "absolute",
        right: -150,
        top: -70
    },
    headerContainer: {
        position: "absolute",
        top: 140,
        left: -30
    },
    headerText: {
        fontFamily: "Sofia",
        fontSize: 50,
        transform: [{ rotate: "-90deg" }]
    },

    bowlIcon: {
        width: 30,
        height: 30
    },
    input: {
        height: 40,
        fontFamily: "Sofia",
        fontSize: 16,
        marginRight: 45,
        marginLeft: 45
    },
    buttonContainer: {
        top: 70,
        justifyContent: "space-around",
    },
    elementButton: {
        width: 70,
        height: 30,
        borderRadius: 10,
        backgroundColor: 'red',
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Sofia"
    },
    submitButton: {
        backgroundColor: "black",
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center"
    }
})

const Stack = createStackNavigator()

export default function Login() {
    return (
        <>
            <NavigationContainer>
                <Stack.Navigator
                    headerMode="none"
                    screenOptions={{
                        gestureEnabled: true,
                        gestureDirection: 'horizontal',
                        cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
                    }}
                >
                    <Stack.Screen
                        name="Login"
                        component={InputField}
                    />
                    <Stack.Screen
                        name="ChooseGender"
                        component={ChooseGender}
                    />
                    <Stack.Screen
                        name="Home"
                        component={Home}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}

