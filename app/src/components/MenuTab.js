import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import Parameters from '../screens/Parameters';
import SearchScreen from '../screens/SearchScreen';
import ResumeScreen from '../screens/ResumeScreen';
import QuizCreation from '../screens/QuizCreationScreen';
import Account from '../screens/Account';
import joinGame from '../screens/JoinRoom';

const { width  , height} = Dimensions.get('window');
const isMobile = width< height

const Tab = createBottomTabNavigator();

const MenuTab = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarPosition: 'top',
                tabBarStyle: styles.tabBarStyle,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'black',
                tabBarLabelStyle: styles.tabBarLabelStyle,
                tabBarIcon: () => null,
            })}
            initialRouteName="home"
        >
            <Tab.Screen
                name="home"
                component={HomeScreen}
                options={{
                    tabBarLabel: ({ focused, color }) => (
                        <Text
                            style={[
                                styles.tabBarLabel,
                                focused && styles.tabBarLabelFocused,
                                { color }
                            ]}
                        >
                            Accueil
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name="newQuiz"
                component={Parameters}
                options={{
                    tabBarLabel: ({ focused, color }) => (
                        <Text
                            style={[
                                styles.tabBarLabel,
                                focused && styles.tabBarLabelFocused,
                                { color }
                            ]}
                        >
                            Partie rapide
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name="search"
                component={SearchScreen}
                options={{
                    tabBarLabel: ({ focused, color }) => (
                        <Text
                            style={[
                                styles.tabBarLabel,
                                focused && styles.tabBarLabelFocused,
                                { color }
                            ]}
                        >
                            Quiz de la communauté
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name="joinGame"
                component={joinGame}
                options={{
                    tabBarLabel: ({ focused, color }) => (
                        <Text
                            style={[
                                styles.tabBarLabel,
                                focused && styles.tabBarLabelFocused,
                                { color }
                            ]}
                        >
                            Rejoindre une partie
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name="resumeQuiz"
                component={ResumeScreen}
                options={{
                    tabBarLabel: ({ focused, color }) => (
                        <Text
                            style={[
                                styles.tabBarLabel,
                                focused && styles.tabBarLabelFocused,
                                { color }
                            ]}
                        >
                            Reprendre une partie
                        </Text>
                    ),
                }}
            />
            { !isMobile && (
                <Tab.Screen
                    name="quizCreation"
                    component={QuizCreation}
                    options={{
                        tabBarLabel: ({ focused, color }) => (
                            <Text
                                style={[
                                    styles.tabBarLabel,
                                    focused && styles.tabBarLabelFocused,
                                    { color }
                                ]}
                            >
                                Créer votre propre quiz
                            </Text>
                        ),
                    }}
                />
            )}
            <Tab.Screen
                name="account"
                component={Account}
                options={{
                    tabBarLabel: ({ focused, color }) => (
                        <Text
                            style={[
                                styles.tabBarLabel,
                                focused && styles.tabBarLabelFocused,
                                { color }
                            ]}
                        >
                            Votre compte
                        </Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: '#fff',
        height: 70,
    },
    tabBarLabelStyle: {
        fontFamily: 'LobsterTwo_400Regular',
        fontSize: 25,
        textAlign: 'center',
    },
    tabBarLabel: {
        fontFamily: 'LobsterTwo_400Regular',
        fontSize: 25,
        textAlign: 'center',
    },
    tabBarLabelFocused: {
        transform: [{ scale: 1.2 }],
        transition: 'transform 0.3s ease',
        textDecorationLine: 'underline',
    },
});

export default MenuTab;
