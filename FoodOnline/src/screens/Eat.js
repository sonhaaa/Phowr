import React, { Component } from "react"
import { Animated, View, PanResponder, StyleSheet, Image, Text } from "react-native"

import { string } from ".././strings/en"

import {
    createStackNavigator,
    CardStyleInterpolators
} from '@react-navigation/stack'

import auth from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"

export default class Eat extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isMoreMeat: false,
            isMoreHanh: false,
            isChilisause: false,
            uid: ""
        }
    }

    getFood = () => {
        const uid = this.state.uid
        database().ref(`Users/${uid}/currentFood`).once("value", snapshot => console.log(snapshot.val()))
    }

    componentDidMount() {
        const uid = auth().currentUser.uid

        this.setState({ uid: uid })

        database()
            .ref(`Users/${uid}/currentFood`)
            .once("value", snapshot =>
                this.setState({
                    isMoreMeat: snapshot.val().isMoreMeat,
                    isMoreHanh: snapshot.val().isMoreHanh,
                    isChilisause: snapshot.val().isChilisause,
                })
            )
    }

    render() {
        const { isMoreMeat, isMoreHanh, isChilisause } = this.state

        return (
            <View style={styles.mainContainer}>
                <View style={styles.dropZone}>
                    <Image
                        source={require("../assets/img/Pho/normal.png")}
                        style={{ width: 170, height: 170 }}
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
                <View style={styles.ballContainer} />
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <Draggable2 />
                    <Draggable />
                </View>
            </View>
        );
    }
}

class Draggable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDraggable: true,
            dropAreaValues: null,
            pan: new Animated.ValueXY(),
            opacity: new Animated.Value(1)
        };
    }

    componentWillMount() {
        this._val = { x: 0, y: 0 }
        this.state.pan.addListener((value) => this._val = value);

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => true,
            onPanResponderGrant: (e, gesture) => {
                this.state.pan.setOffset({
                    x: this._val.x,
                    y: this._val.y
                })
                this.state.pan.setValue({ x: 0, y: 0 })
            },
            onPanResponderMove: Animated.event([
                null, { dx: this.state.pan.x, dy: this.state.pan.y }
            ]),
            onPanResponderRelease: (e, gesture) => {
                if (this.isDropArea(gesture)) {
                    this.setState({
                        showDraggable: false
                    })
                }

                if (this.isDropArea2(gesture)) {
                    this.setState({
                        showDraggable: true
                    })
                }
            }
        });
    }

    isDropArea(gesture) {
        if (gesture.moveY < 270 && gesture.moveX > 100 && gesture.moveX < 300 && gesture.moveY > 120) {
            return true
        } else { return false }
    }

    isDropArea2(gesture) {
        return gesture.moveY > 450;
    }

    render() {
        return (
            <View style={{ width: "20%", alignItems: "center" }}>
                {this.renderDraggable()}
            </View>
        );
    }

    renderDraggable() {
        const panStyle = {
            transform: this.state.pan.getTranslateTransform()
        }
        if (this.state.showDraggable) {
            return (
                <View style={{ position: "absolute" }}>
                    <Animated.Image
                        source={require("../assets/img/Pho/hand.png")}
                        {...this.panResponder.panHandlers}
                        style={[panStyle, { width: 100, height: 100 }]}
                        resizeMode="contain"
                    />
                </View>
            );
        } else {
            return (
                <View style={{ position: "absolute" }}>
                    <Animated.Image
                        source={require("../assets/img/Pho/handwithpho.png")}
                        {...this.panResponder.panHandlers}
                        style={[panStyle, { width: 100, height: 100 }]}
                        resizeMode="contain"
                    />
                </View>
            );
        }
    }
}

class Draggable2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDraggable: true,
            dropAreaValues: null,
            pan: new Animated.ValueXY(),
            opacity: new Animated.Value(1)
        };
    }

    componentWillMount() {
        this._val = { x: 0, y: 0 }
        this.state.pan.addListener((value) => this._val = value);

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => true,
            onPanResponderGrant: (e, gesture) => {
                this.state.pan.setOffset({
                    x: this._val.x,
                    y: this._val.y
                })
                this.state.pan.setValue({ x: 0, y: 0 })
            },
            onPanResponderMove: Animated.event([
                null, { dx: this.state.pan.x, dy: this.state.pan.y }
            ]),
            onPanResponderRelease: (e, gesture) => {
                if (this.isDropArea(gesture)) {
                    this.setState({
                        showDraggable: false
                    })
                }

                if (this.isDropArea2(gesture)) {
                    this.setState({
                        showDraggable: true
                    })
                }
            }
        });
    }

    isDropArea(gesture) {
        if (gesture.moveY < 200 && gesture.moveX > 100 && gesture.moveX < 300 && gesture.moveY > 50) {
            return true
        } else { return false }
    }

    isDropArea2(gesture) {
        return gesture.moveY > 500;
    }

    render() {
        return (
            <View style={{ width: "20%", alignItems: "center" }}>
                {this.renderDraggable()}
            </View>
        );
    }

    renderDraggable() {
        const panStyle = {
            transform: this.state.pan.getTranslateTransform()
        }
        if (this.state.showDraggable) {
            return (
                <View style={{ position: "absolute" }}>
                    <Animated.Image
                        source={require("../assets/img/Pho/holdspoon.png")}
                        {...this.panResponder.panHandlers}
                        style={[panStyle, { width: 100, height: 100 }]}
                        resizeMode="contain"
                    />
                </View>
            );
        } else {
            return (
                <View style={{ position: "absolute" }}>
                    <Animated.Image
                        source={require("../assets/img/Pho/holdspoonwithsoup.png")}
                        {...this.panResponder.panHandlers}
                        style={[panStyle, { width: 100, height: 100 }]}
                        resizeMode="contain"
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        borderRadius: 15,
        backgroundColor: "white"
    },
    ballContainer: {
        height: 100
    },
    row: {
        flexDirection: "row"
    },
    dropZone: {
        height: 200,
        marginTop: 70,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        marginTop: 25,
        marginLeft: 5,
        marginRight: 5,
        textAlign: "center",
        color: "#fff",
        fontSize: 25,
        fontWeight: "bold"
    }
});