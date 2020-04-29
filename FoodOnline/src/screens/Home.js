import React, { Component } from "react"
import { View, Text, Button, TouchableOpacity, Image } from "react-native"

import { NavigationContainer } from '@react-navigation/native'
import {
    createStackNavigator,
    CardStyleInterpolators
} from '@react-navigation/stack'

import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps'
import { mapStyle } from '../constants/mapStyle'
import Geolocation from '@react-native-community/geolocation'

import auth from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"

import Modal from 'react-native-modalbox'

import Prepare from "./Prepare"

import { string } from ".././strings/en"

class ShowMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            currentUserUid: "",
            allUserInfo: [],
            allPlaceInfo: [],
            longitude: 107.0311464,
            latitude: 16.8178796,
            placeIdToGoQueue: 0,
            welcome: "Hello!"
        }
    }

    getCurrentUserUid = () => {
        const uid = auth().currentUser.uid

        this.setState({
            currentUserUid: uid,
        })
    }

    getUserLocation = () => {
        Geolocation.getCurrentPosition(info => {
            const latitude = info.coords.latitude
            const longitude = info.coords.longitude

            this.setState = ({
                longitude: longitude,
                latitude: latitude
            })

            this.writeLocationToFB(latitude, longitude);
        },
            err => this.refs.mapSignModal.open(),
            { timeout: 7000, maximumAge: 1000 })
    }

    writeLocationToFB = (latitude, longitude) => {
        const uid = this.state.currentUserUid

        database()
            .ref("Users/" + uid + "/coordinates")
            .set({
                latitude: latitude,
                longitude: longitude
            })
    }

    getAllUserInfoFromFB = async () => {
        let allUsersInfo = []
        let id = 0

        const userSnapshot = await database()
            .ref("Users/")
            .orderByKey()
            .once("value")

        userSnapshot.forEach(snapshot => {
            const value = snapshot.val()

            allUsersInfo.push({
                id: id,
                username: value.username,
                coordinates: value.coordinates,
                gender: value.gender
            })

            id += 1
        })

        this.setState({
            allUserInfo: allUsersInfo,
        })
    }

    getAllPlaceInfoFromFB = async () => {
        let allPlacesInfo = []
        let id = 0

        const snapshot = await database()
            .ref("places/")
            .orderByKey()
            .once("value")

        snapshot.forEach(snapshot => {
            const value = snapshot.val()

            allPlacesInfo.push({
                id: id,
                placeName: value.placeName,
                coordinates: value.coordinates,
                pid: value.pid
            })

            id += 1
        })

        this.setState({ allPlaceInfo: allPlacesInfo })
    }

    componentDidMount() {
        const date = new Date();
        const getHour = date.getHours();
        if (getHour >= 0 && getHour < 12) {
            this.setState({ welcome: string.goodMorning })
        } else if (getHour >= 12 && getHour < 18) {
            this.setState({ welcome: string.goodAfternoon })
        } else if (getHour >= 18 && getHour < 22) {
            this.setState({ welcome: string.goodEvening })
        } else if (getHour >= 22 && getHour < 24) {
            this.setState({ welcome: string.goodNight })
        }

        this.getAllPlaceInfoFromFB()
        this.getCurrentUserUid()
        this.getUserLocation()
        this.getAllUserInfoFromFB()

        this.refs.signModal.open()
    }

    navigateToPrepare = placename => {
        const uid = this.state.currentUserUid
        database().ref(`Users/${uid}/`).update({
            nowInPlace: placename
        })
            .then(() => this.props.navigation.navigate("Prepare"))
    }

    render() {
        const { welcome, latitude, longitude, allUserInfo, allPlaceInfo } = this.state

        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <View style={{ height: "8%", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontFamily: "Sofia" }}> {welcome} </Text>
                </View>

                {/* RENDER USER LOCATION */}
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1, marginRight: 25, marginLeft: 25, borderRadius: 20, marginBottom: 25 }}
                    customMapStyle={mapStyle}
                    region={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    {/* RENDER USER LOCATION */}

                    {allUserInfo.map(user => (
                        user.coordinates !== undefined ? (
                            <Marker
                                key={user.id}
                                title={user.username}
                                coordinate={{
                                    latitude: user["coordinates"].latitude,
                                    longitude: user["coordinates"].longitude,
                                }}
                                style={{ width: 30, height: 30 }}
                                image={user.gender === "male" ? require("../assets/img/Markers/malemarker.png") : require("../assets/img/Markers/femalemarker.png")}
                            >
                                {/* <Image

                                source={user.gender === "male" ? require("../assets/img/Markers/malemarker.png") : require("../assets/img/Markers/femalemarker.png")}
                            /> */}
                            </Marker>) : null
                    ))}

                    {/* RENDER PLACE LOCATION */}
                    {allPlaceInfo.map(place => (
                        < Marker
                            key={place.placeName}
                            // title={place.placeName}
                            coordinate={{
                                latitude: place["coordinates"].latitude,
                                longitude: place["coordinates"].longitude,
                            }}
                            image={require("../assets/Phoshop.png")}
                        >
                            <Callout
                                style={{
                                    borderRadius: 10,
                                    height: 50,
                                    justifyContent: "space-around"
                                }}
                                onPress={() => this.navigateToPrepare(place.pid)}
                            >
                                <Text style={{ fontFamily: "Sofia" }}> {place.placeName} </Text>

                                <TouchableOpacity
                                    style={{ backgroundColor: "black", borderRadius: 10, justifyContent: "center", alignItems: "center" }}

                                >
                                    <Text style={{ fontFamily: "Sofia", color: "white" }}>{string.go}</Text>
                                </TouchableOpacity>

                            </Callout>
                        </Marker>
                    ))}

                    {/* HOANG SA & TRUONG SA BELONG TO VIETNAM */}
                    <Marker
                        key="hoangsa"
                        title="Hoang Sa belongs to Vietnam"
                        coordinate={{
                            latitude: 16.242852,
                            longitude: 112.202243,
                        }}
                        icon={require("../assets/img/Markers/VietnamIsland.png")}
                    />
                    <Marker
                        title="Truong Sa belongs to Vietnam"
                        key="truongsa"
                        coordinate={{
                            latitude: 10.802649,
                            longitude: 115.692315,
                        }}
                        icon={require("../assets/img/Markers/VietnamIsland.png")}
                    />
                </MapView>

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
                            source={require("../assets/img/marker.png")}
                            style={{ width: 30, height: 30 }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={{ alignItems: "center", marginLeft: 25, marginRight: 25, marginBottom: 25 }}>
                        <Text style={{ fontFamily: "Sofia", textAlign: "center" }}> {string.locationSign} </Text>
                    </View>
                </Modal>

                < Modal style={{
                    width: "50%",
                    height: "25%",
                    borderRadius: 10,
                    alignItems: "center"
                }}
                    position={"center"}
                    ref={"mapSignModal"}
                    swipeToClose={false}
                    backdropColor="grey"
                    animationDuration={300}
                    backButtonClose={true}
                >
                    <View style={{ width: 70, height: 70, backgroundColor: "black", borderRadius: 35, top: -35, justifyContent: "center", alignItems: "center" }}>
                        <Image
                            source={require("../assets/img/world.png")}
                            style={{ width: 30, height: 30 }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={{ alignItems: "center", marginLeft: 25, marginRight: 25, marginBottom: 25 }}>
                        <Text style={{ fontFamily: "Sofia", textAlign: "center" }}> {string.mapSign} </Text>
                    </View>
                </Modal>
            </View>
        )
    }
}

const Stack = createStackNavigator()

export default function Home() {
    return (
        <>
            <NavigationContainer independent={true}>
                <Stack.Navigator
                    headerMode="none"
                    screenOptions={{
                        gestureEnabled: true,
                        gestureDirection: 'horizontal',
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                >
                    <Stack.Screen
                        name="Home"
                        component={ShowMap}
                    />
                    <Stack.Screen
                        name="Prepare"
                        component={Prepare}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}