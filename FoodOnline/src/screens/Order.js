import React, { Component } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"

import { string } from ".././strings/en"

import { NavigationContainer } from '@react-navigation/native'
import {
    createStackNavigator,
    CardStyleInterpolators
} from '@react-navigation/stack'

import Eat from "./Eat"
import Modal from 'react-native-modalbox'

import auth from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"

class ShowOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isMoreMeat: false,
            isMoreHanh: false,
            isChilisause: false,
            uid: ""
        }
    }

    componentDidMount() {
        const uid = auth().currentUser.uid
        this.setState({ uid: uid })
    }

    order = (isMoreMeat, isMoreHanh, isChilisause) => {
        const uid = this.state.uid
        database().ref(`Users/${uid}/`).update({
            currentFood: {
                isMoreHanh: isMoreHanh,
                isMoreMeat: isMoreMeat,
                isChilisause: isChilisause
            }
        }).then(() => this.props.navigation.navigate("Eat"))
    }

    render() {
        const { isMoreMeat, isMoreHanh, isChilisause } = this.state

        return (
            <View style={{ flex: 1, borderRadius: 15 }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", borderRadius: 15 }}>
                    <Image
                        source={require("../assets/img/Pho/normal.png")}
                        style={{
                            width: 150,
                            height: 150
                        }}
                        resizeMode="contain"
                    />

                    {isMoreMeat ? (
                        <View style={{ position: "absolute" }}>
                            <Image
                                source={require("../assets/img/Pho/moremeat.png")}
                                style={{
                                    width: 90,
                                    height: 90,
                                    marginBottom: 18,
                                    marginLeft: 30
                                }}
                                resizeMode="contain"
                            />
                        </View>
                    ) : (null)}

                    {isMoreHanh ? (
                        <View style={{ position: "absolute" }}>
                            <Image
                                source={require("../assets/img/Pho/morehanh.png")}
                                style={{
                                    width: 90,
                                    height: 90,
                                    marginBottom: 18,
                                    marginLeft: 30
                                }}
                                resizeMode="contain"
                            />
                        </View>
                    ) : (null)}

                    {isChilisause ? (
                        <View style={{ position: "absolute" }}>
                            <Image
                                source={require("../assets/img/Pho/chilisause.png")}
                                style={{
                                    width: 90,
                                    height: 90,
                                    marginBottom: 18,
                                    marginLeft: 30
                                }}
                                resizeMode="contain"
                            />
                        </View>
                    ) : (null)}

                </View>

                <ScrollView style={{ flex: 1 }}>
                    <View style={{ alignItems: "center" }}>
                        <View style={{ marginTop: 10, alignItems: "center" }}>
                            <Text style={{ fontFamily: "Sofia" }}>{string.moreMeat}</Text>
                            <TouchableOpacity onPress={() => this.setState({ isMoreMeat: !isMoreMeat })}>
                                <Image
                                    source={require("../assets/img/Pho/meat.png")}
                                    style={{
                                        width: 50,
                                        height: 50
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>

                        </View>

                        <View style={{ marginTop: 10, alignItems: "center" }}>
                            <Text style={{ fontFamily: "Sofia" }}>{string.moreScallion}</Text>
                            <TouchableOpacity onPress={() => this.setState({ isMoreHanh: !isMoreHanh })}>
                                <Image
                                    source={require("../assets/img/Pho/scallion.png")}
                                    style={{
                                        width: 50,
                                        height: 50
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 10, marginBottom: 15, alignItems: "center" }}>
                            <Text style={{ fontFamily: "Sofia" }}>{string.chiliSauce}</Text>
                            <TouchableOpacity onPress={() => this.setState({ isChilisause: !isChilisause })}>
                                <Image
                                    source={require("../assets/img/Pho/chili.png")}
                                    style={{
                                        width: 50,
                                        height: 50
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={{ height: 50, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}
                    onPress={() => this.order(isMoreMeat, isMoreHanh, isChilisause)}
                >
                    <Text>{string.order}</Text>
                </TouchableOpacity>


            </View>
        )
    }
}

const Stack = createStackNavigator()

export default function Order() {
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
                    name="Order"
                    component={ShowOrder}
                />
                <Stack.Screen
                    name="Eat"
                    component={Eat}
                />
            </Stack.Navigator>

        </>
    )
}