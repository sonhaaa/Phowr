import React, { Component } from "react"
import { View, Text, TouchableOpacity, ScrollView } from "react-native"

import { string } from ".././strings/en"

import {
    createStackNavigator,
    CardStyleInterpolators
} from '@react-navigation/stack'

import InsideStore from "./InsideStore"
import Home from "./Home"

import auth from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"

import { Backdrop } from "react-native-backdrop"

class ShowQueue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUserUid: "",
            placeCurrentUserIn: "",
            currentUserName: "",
            visible: false,
            allUserInQueueInfo: []
        }
    }

    getCurrentUserInfo = () => {
        const uid = auth().currentUser.uid
        var currentUserName, placeCurrentUserIn = "a"
        var test = {}
        var currentUserName = ""

        this.setState({
            currentUserUid: uid,
        })

        database().ref(`Users/${uid}/`)
            .on("value", snapshot => {
                var place = ""
                place = snapshot.val().nowInPlace
                console.log(place)
                placeCurrentUserIn = snapshot.val().nowInPlace
                currentUserName = snapshot.val().username

            })
        console.log(place, placeCurrentUserIn, currentUserName)
        // database()
        // .ref(`places/${place}/peopleInQueue`)
        // .on("value", snapshot => {
        //     test = Object.values(snapshot.val())
        // })

    }

    handleOpen = () => {
        this.setState({ visible: true })
    }

    handleClose = () => {
        this.setState({ visible: false })
    }

    componentDidMount() {
        this.setState({ visible: true })
        this.getCurrentUserInfo()
    }

    goBackHome = () => {
        this.RBSheet.close()
        this.props.navigation.navigate("Home")

        const uid = this.state.currentUserUid
        database().ref(`Users/${uid}/nowInPlace`).remove()
    }

    joinQueue = () => {
        const place = this.state.placeCurrentUserIn

        database()
            .ref(`places/${place}/peopleInQueue`)
            .orderByChild("peopleInQueue")
            .once("value", snapshot => {
                var test = Object.keys(snapshot.val())
                let maxPosition = 0

                test.forEach(val => Number(val) > maxPosition ? maxPosition = Number(val) : maxPosition = maxPosition)

                let position = maxPosition + 1
                database().ref(`places/${place}/peopleInQueue/${position}`)
                    .update({
                        isDone: false,
                        username: this.state.currentUserName,
                    })
                    .then(() => this.setState({ visible: false }))
            })
    }

    render() {
        const { visible, allUserInQueueInfo, currentUserName } = this.state

        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={{ alignItems: "flex-end" }}>
                        <View
                            style={{
                                alignItems: "flex-end",
                                marginTop: 50,
                                marginRight: 50
                            }}>
                            <TouchableOpacity
                                style={{
                                    width: 70,
                                    height: 70,
                                    backgroundColor: "red",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                <Text style={{ color: "white" }}>Store</Text>
                            </TouchableOpacity>
                        </View>

                        {allUserInQueueInfo.length > 0 ? allUserInQueueInfo.forEach(user => {

                            user.username === currentUserName ? (
                                <View
                                    style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 35,
                                        backgroundColor: "yellow",
                                        marginRight: 70
                                    }}
                                >
                                    <Text> {user.username} </Text>
                                </View>
                            ) : (
                                    <View
                                        style={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: 35,
                                            backgroundColor: "red",
                                            marginRight: 70
                                        }}
                                    >
                                        <Text> {user.username} </Text>
                                    </View>
                                )

                        }) : null}

                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={{
                        height: 30,
                        width: "100%",
                        backgroundColor: "yellow",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={() => this.setState({ visible: true })}>
                    <Text>^</Text>
                </TouchableOpacity>

                <Backdrop
                    visible={visible}
                    handleOpen={this.handleOpen}
                    handleClose={this.handleClose}
                    onClose={() => { }}
                    swipeConfig={{
                        velocityThreshold: 0.3,
                        directionalOffsetThreshold: 80,
                    }}
                    animationConfig={{
                        speed: 14,
                        bounciness: 4,
                    }}
                    overlayColor="rgba(0,0,0,0.32)"
                    backdropStyle={{
                        backgroundColor: '#fff',
                    }}>
                    <View>
                        <TouchableOpacity style={{ width: 200, height: 50, backgroundColor: "red" }}
                            onPress={this.goBackHome}>
                            <Text>{string.goHome}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ width: 200, height: 50, backgroundColor: "red" }}
                            onPress={this.joinQueue}>
                            <Text>{string.goQueue}</Text>
                        </TouchableOpacity>
                    </View>
                </Backdrop>

            </View>
        )
    }
}

const Stack = createStackNavigator()

export default function Queue() {
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
                    name="ShowQueue"
                    component={ShowQueue}
                />
                <Stack.Screen
                    name="InsideStore"
                    component={InsideStore}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                />
            </Stack.Navigator>

        </>
    )
}