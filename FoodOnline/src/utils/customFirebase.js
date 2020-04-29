import database from "@react-native-firebase/database"
import auth from "@react-native-firebase/auth"

export function writeToFB(ref, email, password, next) {
    database().ref(ref).set({
        email: email,
        password: password,
        onCreate: 'true',
    })
        .then(next)
}