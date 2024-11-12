import { Text, View, TextInput } from 'react-native';

export default function ResumeScreen() {
    return (
        <View>
            <Text>Reprenez votre partie</Text>
            <TextInput placeholder="Identifiant de votre partie" />
        </View>
    );
}