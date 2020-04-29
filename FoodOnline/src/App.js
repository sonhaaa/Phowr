import React from 'react';
import { StatusBar } from 'react-native';

import Login from './screens/Login';

const App: () => React$Node = () => {
    return (
        <>
            <StatusBar hidden={true} />
            <Login />
        </>
    );
};

export default App;
