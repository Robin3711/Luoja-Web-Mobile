import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { userRegister } from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import { getPlatformStyle } from '../utils/utils';

const styles = getPlatformStyle();


export default function Login() {

    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try{
            await userRegister(email, password);
            navigation.navigate('menuDrawer', { screen: 'account' });
        }
        catch(error){
            alert(error.message);
        }
    };

    return (
        <View style={styles.loginView}>
            <Text>Email</Text>
            <TextInput
                style={styles.loginInput}
                onChangeText={setEmail}
                value={email}
                placeholder="Email"
                autoFocus={true}
            />
            <Text>Password</Text>
            <TextInput
                style={styles.loginInput}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                secureTextEntry={true}
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                <Text>S'inscrire</Text>
            </TouchableOpacity>
        </View>
    );
}