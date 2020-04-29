import React from 'react';
import { View, Text } from 'react-native';

export const ChatLineHolder = (props) => {
    return (
        <View style={{
            flexDirection: 'row', alignItems: 'flex-start',
            borderRadius: 8, marginLeft: 5, marginRight: 5
        }} >
            <Text style={{ color: 'black', marginBottom: 5, fontFamily: "Sofia" }} >{props.sender}:</Text>
            <Text style={{ color: "#666665", fontFamily: "Sofia" }}>{props.chatContent}</Text>
        </View>
    );

};