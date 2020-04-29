import React, { Component } from "react"
import { View, Text, Button, TouchableOpacity, Image, StyleSheet } from "react-native"

import { NavigationContainer } from '@react-navigation/native'
import {
    createStackNavigator,
    CardStyleInterpolators
} from '@react-navigation/stack'

import { string } from ".././strings/en"

import Place from "./Place"

import auth from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"

class ShowPrepare extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isHelmet: false,
            isMask: false,
            icon: [
                require("../assets/img/Traffics/bike.png"),
                require("../assets/img/Traffics/car.png"),
                require("../assets/img/Traffics/contai.png"),
                require("../assets/img/Traffics/honda.png"),
                require("../assets/img/Traffics/motor.png"),
                require("../assets/img/Traffics/motorbike.png"),
                require("../assets/img/Traffics/plane.png"),
                require("../assets/img/Traffics/scooter.png"),
            ],
            chooseIcon: "",
            gender: "male",
        }
    }

    componentDidMount() {
        this.setState({ chooseIcon: this.state.icon[Math.floor(Math.random() * this.state.icon.length)] })

        const uid = auth().currentUser.uid

        database().ref(`Users/${uid}/`).once("value", snap => this.setState({ gender: snap.val().gender }))
    }

    render() {
        const { isHelmet, isMask, icon, gender } = this.state

        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <View style={{ flex: 1 }} />

                <View style={{ flex: 4, flexDirection: "row" }}>
                    <View style={{ flex: 2, justifyContent: "center", left: 45 }}>
                        <TouchableOpacity style={{}}
                            onPress={() => this.setState({ isHelmet: !isHelmet })}>
                            <Text style={{ fontFamily: "Sofia", fontSize: 20, color: isHelmet ? "black" : "grey" }}> {string.helmet} </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginTop: 30 }}
                            onPress={() => this.setState({ isMask: !isMask })}>
                            <Text style={{ fontFamily: "Sofia", fontSize: 20, color: isMask ? "black" : "grey" }}> {string.mask} </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 3 }}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
                            <Image
                                source={gender === "male" ? require("../assets/img/male.png") : require("../assets/img/female.png")}
                                style={{
                                    width: 150,
                                    height: 150
                                }}
                                resizeMode="contain"
                            />
                            {isHelmet ? (
                                <View style={{ position: "absolute" }}>
                                    <Image
                                        source={require("../assets/img/helmet.png")}
                                        resizeMode="contain"
                                        style={{ width: 90, height: 90, marginBottom: 130 }}
                                    />
                                </View>
                            ) : (null)}
                            {isMask ? (
                                <View style={{ position: "absolute" }}>
                                    <Image
                                        source={require("../assets/img/mask.png")}
                                        resizeMode="contain"
                                        style={{ width: 50, height: 50, marginBottom: 0 }}
                                    />
                                </View>
                            ) : (null)}
                        </View>
                    </View>
                </View>

                <View style={{ flex: 2, flexDirection: "row", justifyContent: "space-between" }}>

                    <Text
                        style={{
                            fontFamily: "Sofia",
                            fontSize: 45,
                            marginLeft: 45,
                            top: 25
                        }}>{string.go}</Text>

                    <TouchableOpacity
                        style={{
                            backgroundColor: "black",
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 45
                        }}
                        onPress={() => this.props.navigation.navigate("Place")}>
                        <Image
                            source={this.state.chooseIcon}
                            style={{
                                width: 40,
                                height: 40
                            }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const Stack = createStackNavigator()

export default function Prepare() {
    return (
        <>

            <Stack.Navigator
                headerMode="none"
                screenOptions={{
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                    cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={ShowPrepare}
                />
                <Stack.Screen
                    name="Place"
                    component={Place}
                />
            </Stack.Navigator>

        </>
    )
}