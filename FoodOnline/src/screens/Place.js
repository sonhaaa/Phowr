import React, { Component } from "react"
import { View, Text, TextInput, TouchableOpacity, FlatList, ImageBackground } from "react-native"

import { string } from ".././strings/en"

import Modal from 'react-native-modalbox'
import Order from "./Order"
import { ChatLineHolder } from './components/ChatLineHolder';

import auth from "@react-native-firebase/auth"
import database from "@react-native-firebase/database"


export default class Place extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            isDisabled: false,
            currentUserUid: "",
            currentUsername: "",
            currentInPlace: "",
            chatData: [],
            chatInputContent: ""
        }
    }

    getCurrentUserUid = () => {
        const uid = auth().currentUser.uid

        database().ref(`Users/${uid}`).once("value", snap =>
            database().ref(`places/${snap.val().nowInPlace}/chatRoom`).on("value", snapshot => {

                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    this.setState({
                        chatData: Object.values(snapshot.val()),
                        currentInPlace: snap.val().nowInPlace
                    });
                }
            })
        )
    }

    sendMessage = () => {
        const place = this.state.currentInPlace

        database().ref(`places/${place}/chatRoom`).push({
            username: this.state.currentUsername,
            chatContent: this.state.chatInputContent,
        });
        this.setState({
            chatInputContent: ''
        });
    }

    onChangeChatInput = (text) => {
        this.setState({
            chatInputContent: text
        });
    }

    renderChatLine = (item) => {
        return (
            <ChatLineHolder sender={item.username} chatContent={item.chatContent} />
        );
    };

    componentDidMount() {
        const uid = auth().currentUser.uid
        database().ref(`Users/${uid}`).once("value", snap => this.setState({ currentUsername: snap.val().username }))
        this.getCurrentUserUid()
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <ImageBackground
                    imageStyle={{ opacity: 0.4 }}
                    source={require("../assets/img/background.jpg")}
                    style={{ flex: 9 }}
                >
                    <Text style={{ fontFamily: "Sofia", color: "white", marginLeft: 10, fontSize: 10 }} >Image by Victor Ngai</Text>

                    <View style={{ height: 300, marginLeft: 45, marginRight: 45, top: 70 }}>
                        <FlatList data={this.state.chatData} renderItem={({ item }, index) => this.renderChatLine(item)} />
                    </View>

                    <View style={{ marginLeft: 45, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 50 }}>
                        <View style={{ flex: 4, justifyContent: "center" }} >
                            <TextInput placeholder={string.chatHolder} value={this.state.chatInputContent}
                                onChangeText={(text) => this.onChangeChatInput(text)} style={{ height: 100, fontSize: 16, fontFamily: "Sofia" }} />
                        </View>
                        <View style={{ width: 50, height: 50, borderRadius: 25, marginRight: 45, backgroundColor: "#4a4a49", justifyContent: "center", alignItems: "center" }} >
                            <TouchableOpacity onPress={() => this.sendMessage()}  >
                                <Text style={{ color: 'white', fontSize: 15, fontFamily: "Sofia" }} >
                                    {string.send}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

                < Modal style={{
                    width: "90%",
                    height: "80%",
                }}
                    position={"center"}
                    ref={"orderModal"}
                    swipeToClose={false}
                    backdropColor="grey"
                >
                    <Order />
                    <TouchableOpacity
                        style={{ height: 50, justifyContent: "center", alignItems: "center" }}
                        onPress={() => this.refs.orderModal.close()}
                    >
                        <Text style={{ fontFamily: "Sofia" }}> {string.close} </Text>
                    </TouchableOpacity>
                </Modal>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: "white",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    onPress={() => this.refs.orderModal.open()}>
                    <Text style={{ fontFamily: "Sofia", fontSize: 18 }}>{string.order}</Text>
                </TouchableOpacity>
            </View >
        )
    }
}