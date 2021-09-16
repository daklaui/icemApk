import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {AsyncStorage, SafeAreaView, Text, View} from 'react-native';
import Login from './src/screens/Login';
import AddUser from 'src/screens/Users/add';
import ListUsers from 'src/screens/Users/List';
import Home from 'src/screens/Home';
import OfLancer from 'src/screens/OF/Lancer';
import OfUrgent from 'src/screens/OF/ByStatus';
import {AuthContext} from 'src/utils/auth-context';
import {loginWithEmail} from 'src/services/auth-service';
const Stack = createNativeStackNavigator();

const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            isLoading: false,
            userToken: action.token,
            user: action.user,
          };
        case 'RESTORE_THEME':
        case 'UPDATE_THEME':
          return {
            ...prevState,
            theme: action.theme,
          };
        case 'RESTORE_LANGUAGE':
        case 'UPDATE_LANGUAGE':
          return {
            ...prevState,
            language: action.language,
          };
        case 'UPDATE_USER':
          return {
            ...prevState,
            user: action.user,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isLoading: true,
          };
        case 'SING_IN_SUCCESS':
          return {
            ...prevState,
            isLoading: false,
            userToken: action.token,
            user: action.user,
          };
        case 'SING_IN_ERROR':
          return {
            ...prevState,
            isLoading: false,
            error: action.error,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignOut: true,
            userToken: null,
            user: {},
            error: null,
          };
      }
    },
    {
      isLoading: false,
      isSignOut: false,
      userToken: null,
      user: {},
      error: null,
      theme: 'light',
      language: 'en',
    },
  );
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        const theme = await AsyncStorage.getItem('theme');
        const language = await AsyncStorage.getItem('language');
        if (userJson) {
          const {token, user} = JSON.parse(userJson);
          dispatch({type: 'RESTORE_TOKEN', token, user});
        }
        if (theme) {
          dispatch({type: 'RESTORE_THEME', theme});
        }
        if (language) {
          dispatch({type: 'RESTORE_LANGUAGE', language});
        }

        //SplashScreen.hide();
      } catch (e) {
        // Restoring token failed
        console.log(e);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async ({UserName, Password}) => {
        dispatch({type: 'SIGN_IN'});
        try {
          const {token, user} = await loginWithEmail(
            JSON.stringify({UserName, Password}),
          );
          await AsyncStorage.setItem('user', JSON.stringify({token, user}));
          dispatch({type: 'SING_IN_SUCCESS', token, user});
          console.log(token);
        } catch (error) {
          dispatch({type: 'SING_IN_ERROR', error});
          console.log(error);
        }
        //  console.log({UserName, Password});
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('user');
          dispatch({type: 'SIGN_OUT'});
        } catch (e) {
          console.log(e);
        }
      },
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_UP', token: 'dummy-auth-token'});
      },
      changeTheme: async data => {
        await AsyncStorage.setItem('theme', data);
        dispatch({type: 'UPDATE_THEME', theme: data});
      },
      changeLanguage: async data => {
        await AsyncStorage.setItem('language', data);
        dispatch({type: 'UPDATE_LANGUAGE', language: data});
      },
      updateUser: async data => {
        const user = {
          ...state.user,
          ...data,
        };
        dispatch({type: 'UPDATE_USER', user: user});
      },
    }),
    [],
  );
  return (
    <NavigationContainer>
      <AuthContext.Provider value={{...authContext, ...state}}>
        <Stack.Navigator>
          {state.userToken == null ? (
            <Stack.Screen
              options={{headerShown: false}}
              name="LoginScreen"
              component={Login}
            />
          ) : (
            <>
              <Stack.Screen
                options={{headerShown: false}}
                name="Home"
                component={Home}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="AddUser"
                component={AddUser}
              />
              <Stack.Screen
                options={{headerShown: false}}
                name="ListUsers"
                component={ListUsers}
              />
               <Stack.Screen
                options={{headerShown: false}}
                name="OfLancer"
                component={OfLancer}
              />
                 <Stack.Screen
                options={{headerShown: false}}
                name="OfUrgent"
                component={OfUrgent}
              />
            </>
          )}
        </Stack.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  );
};

export default App;
