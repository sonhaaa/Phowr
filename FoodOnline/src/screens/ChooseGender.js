import React, { Component } from "react"
import { View, Text, Button, TouchableOpacity, TextInput, Image, StyleSheet } from "react-native"

import { NavigationContainer } from '@react-navigation/native'
import {
    createStackNavigator,
    CardStyleInterpolators
} from '@react-navigation/stack'

import auth from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"

import Modal from 'react-native-modalbox'

import Home from "./Home"

import { string } from "../strings/en"

class Choose extends Component {
    constructor(props) {
        super(props)
        this.state = {
            gender: "",
            uid: "",
            username: "",
        }
    }

    componentDidMount() {
        const uid = auth().currentUser.uid;
        this.setState({ uid: uid })
    }

    writeUserInfoToFB(gender, username) {
        const uid = this.state.uid;
        const ref = database().ref(`Users/${uid}/`);
        ref.update({
            gender: gender,
            isRegisterComplete: 'true',
            username: username
        }).then(() => this.props.navigation.navigate("Home"))
            .catch(err => this.refs.signUsername.open())
    }

    swithToGender = gender => {
        this.setState({ gender: gender })
    }

    submit = () => {
        if (this.state.username === "") {
            this.refs.signUsername.open()
        } else if (this.state.gender === "") {
            this.refs.signGender.open()
        } else { this.writeUserInfoToFB(this.state.gender, this.state.username) }

    }

    render() {
        const { gender, username } = this.state

        return (
            <View style={styles.container}>

                <View style={styles.imageHeader}>
                    <Image
                        source={require("../assets/img/bowlOfPhoMeat.png")}
                        style={{ width: 400, height: 400, }}
                        resizeMode="contain"
                    />
                </View>
                <View style={{ height: 100 }} />

                <TextInput
                    placeholder={string.yourUsername}
                    value={username}
                    style={styles.input}
                    onChangeText={username => this.setState({ username })}
                    maxLength={8}
                />

                <View style={{ left: 45, top: 20, }}>
                    <TouchableOpacity onPress={() => this.swithToGender("male")}>
                        <Text style={[styles.genderText, { color: gender === "male" ? "#86dcff" : "#c5c5c5" }]}>{string.male}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.swithToGender("female")}
                        style={{
                            marginTop: 20,
                        }}
                    >
                        <Text style={[styles.genderText, { color: gender === "female" ? "#ff5876" : "#c5c5c5" }]}>{string.female}</Text>
                    </TouchableOpacity>

                    <View style={{ justifyContent: "space-between", flexDirection: "row", right: 45, top: 55 }}>
                        <View />
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={this.submit}
                        >
                            <Image
                                source={require("../assets/img/arrow.png")}
                                style={styles.bowlIcon}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                < Modal style={{
                    width: "50%",
                    height: "20%",
                    borderRadius: 10,
                    alignItems: "center"
                }}
                    position={"center"}
                    ref={"signUsername"}
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
                        <Text style={{ fontFamily: "Sofia", textAlign: "center" }}> {string.fillUsername} </Text>
                    </View>
                </Modal>

                < Modal style={{
                    width: "50%",
                    height: "25%",
                    borderRadius: 10,
                    alignItems: "center"
                }}
                    position={"center"}
                    ref={"signGender"}
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
                        <Text style={{ fontFamily: "Sofia", textAlign: "center" }}> {string.fillGender} </Text>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white"
    },
    imageHeader: {
        position: "absolute",
        right: -150,
        top: -70
    },
    input: {
        height: 40,
        fontFamily: "Sofia",
        fontSize: 16,
        marginRight: 45,
        marginLeft: 45
    },
    genderText: {
        fontFamily: "Sofia",
        fontSize: 18
    },
    submitButton: {
        backgroundColor: "black",
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        right: 45
    },
    bowlIcon: {
        width: 30,
        height: 30
    },
})

const Stack = createStackNavigator()

export default function ChooseGender() {
    return (
        <>
            <NavigationContainer independent={true}>
                <Stack.Navigator
                    headerMode="none"
                    screenOptions={{
                        gestureEnabled: true,
                        gestureDirection: 'horizontal',
                        cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
                    }}
                >
                    <Stack.Screen
                        name="Choose"
                        component={Choose}
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