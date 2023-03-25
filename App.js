// import { StatusBar } from 'expo-status-bar';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icons from "react-native-vector-icons/MaterialIcons"
import Icons2 from "react-native-vector-icons/MaterialCommunityIcons"
import Icons3 from "react-native-vector-icons/FontAwesome5"
import Icons4 from "react-native-vector-icons/Ionicons"
import Chats from './component/Chats/Chats';
import SocketContainer from './component/SocketContainer/SocketContainer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './component/Login/Login';
import AuthContainer, { AuthContext } from './component/AuthContainer/AuthContainer';
import { useContext, useState } from 'react';
import Contact from './component/Contact/Contact';
import Search from './component/Search/Search'; 
import Me from './component/Me/Me';
import DetailConversation from './component/DetailConversation/DetailConversation';
import Profile from './component/Profile/Profile';
import AboutDetailConversation from './component/DetailConversation/AboutDetailConversation';
import Storage from './component/Storage/Storage';
import DetailImage from './component/DetailImage/DetailImage';
import Notifications from './component/Notification/Notifications';
import * as Linking from 'expo-linking';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import "expo-dev-client"
import AgoraRtmKit from 'agora-rtm-sdk';

// Khởi tạo đối tượng AgoraRtm
// const client = AgoraRtmKit.createInstance('019c2968a3da4efab5e709e7886b86c8');

// Đăng nhập vào AgoraRtm
// client.login({ token: '<token>', uid: '<uid>' });
// import {createAgoraRtcEngine} from 'react-native-agora';
// const engine = createAgoraRtcEngine();
// engine.initialize({appId: '019c2968a3da4efab5e709e7886b86c8'});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <SocketContainer>
      <AuthContainer>
        <WrapApp />
      </AuthContainer>
    </SocketContainer>
  );
}

const WrapApp= ()=> {
 
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Login"} screenOptions={{animation: "slide_from_right"}}>
        <Stack.Screen options={({route, navigation})=> ({
          headerLeft: ()=> <>
            <Icons onPress={()=> navigation.goBack(-1)} name="close" size={20} />
          </>,
          headerRight: ()=> <>
            <Icons name={"file-download"} size={20} />
          </>,
          headerTitle: ()=> <></>,
          headerBackVisible: false
        })} name={"DetailImage"} component={DetailImage} />
        <Stack.Screen options={({route, navigation})=> ({
          headerTitle: "Kho lưu trữ", headerTitleAlign: "center", headerLeft: ()=> <TouchableHighlight underlayColor={"unset"} onPress={()=> navigation.goBack(-1)}>
            <View style={{padding: 10}}>
              <Icons name={"arrow-back-ios"} color={"#2e89ff"} size={20} />
            </View>
          </TouchableHighlight>
        })} name={"Storage"} component={Storage} />
        <Stack.Screen options={{headerTitle: "Đăng nhập", headerTitleAlign: 'center'}} name={"Login"} component={Login} />
        <Stack.Screen options={{headerTitle: "Đoạn chat", headerTitleAlign: "center", headerLeft: ()=> <></>, headerShown: false}} name={"Tab"} component={TabNavigationContainer} />
        <Stack.Screen options={({ route, navigation }) => ({
          headerTitle: ()=> 
            <TouchableHighlight onPress={()=> navigation.navigate("AboutDetailConversation", {idConversation: route.params?.idConversation, ...route.params})} underlayColor={"unset"}>
              <View style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", padding: 10}}>
                <View style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", padding: 10}}>
                  <Image style={{width: 50, height: 50, borderRadius: 25}} source={{uri: route.params?.imageGroup}} />
                  <Text style={{fontSize: 18, marginLeft:12}}>{route.params?.labelGroup}</Text>
                </View>
              </View>
            </TouchableHighlight>,
          headerLeft: ()=> <TouchableHighlight underlayColor={"unset"} onPress={()=> navigation.goBack(-1)}>
            <View style={{padding: 10}}>
              <Icons name={"arrow-back-ios"} color={"#2e89ff"} size={20} />
            </View>
          </TouchableHighlight>,
          headerRight: ()=> <View style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
            <Icons name={"call"} size={32} color={"#2e89ff"} />
            <TouchableHighlight style={{padding: 10, marginLeft: 18}}>
              <Icons3 onPress={()=> Linking.openURL('https://www.webrtc-experiment.com/MultiStreamsMixer')} name={"video"} size={32} color={"#2e89ff"} />
            </TouchableHighlight>
          </View>,
          headerBackVisible: false
        })} name={"DetailConversation"} component={DetailConversation} />
        <Stack.Screen options={({route})=> ({
          headerTitle: route.params?.username || "", headerTitleAlign: "center", 
        })} name={"Profile"} component={Profile} />
        <Stack.Screen options={({route, navigation})=> ({
          headerTitle: ()=> <></>,
          headerBackVisible: false,
          headerLeft: ()=> <TouchableHighlight underlayColor={"unset"} onPress={()=> navigation.goBack(-1)}>
            <View style={{padding: 10}}>
              <Icons name={"arrow-back-ios"} color={"#2e89ff"} size={20} />
            </View>
          </TouchableHighlight>
        })} name={"AboutDetailConversation"} component={AboutDetailConversation} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const TabNavigationContainer= ()=> {
  const { data}= useContext(AuthContext)
  const [newChat, setNewChat]= useState(false)
  const closeNewChat= ()=> {
    setNewChat(false)
  }
  return (
    <>
      <Tab.Navigator initialRouteName={"Chats"} screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if(route.name=== "Chats") {
            if(focused=== true) {
              return <Icons2 name={"chat"} size={24} color={"#2e89ff"} />
            }
            else {
              return <Icons2 name={"chat"} size={24} color={"#000"} />
            }
          }
          else if(route.name=== "Contact") {
            if(focused=== true) {
              return <Icons3 name={"user-friends"} size={24} color={"#2e89ff"} />
            }
            else {
              return <Icons3 name={"user-friends"} size={24} color={"#000"} />
            }
          }
          else if(route.name=== "Search") {
            if(focused=== true) {
              return <Icons name={"search"} size={24} color={"#2e89ff"} />
            }
            else {
              return <Icons name={"search"} size={24} color={"#000"} />
            }
          }
          else if(route.name=== "Notifications") {
            if(focused=== true) {
              return <Icons name={"notifications"} size={24} color={"#2e89ff"} />
            }
            else {
              return <Icons name={"notifications"} size={24} color={"#000"} />
            }
          }
          else if(route.name=== "Me") {
            if(focused=== true) {
              return <View style={{padding: 5, borderRadius: 100, backgroundColor: "#2e89ff"}}>
                <Image style={{width: 26, height: 26, borderRadius: 13}} source={{uri: `${data.user.profilePicture}`}} />
              </View>

            }
            else {
              return <Image style={{width: 26, height: 26, borderRadius: 13}} source={{uri: `${data.user.profilePicture}`}} />
            }
          }
        },
        
      })}>
        <Tab.Screen name={"Chats"} component={Chats} options={{headerTitle: ()=> <Text style={{fontSize: 18, fontWeight: "600"}}>Đoạn Chat</Text>, headerTitleAlign: 'center', headerRight: ()=> <Text  onPress={()=> {
          setNewChat(true)
        }} style={{ marginRight: 10}}><Icons4 name={"create-outline"} size={24} /></Text>}} />
        <Tab.Screen name={"Contact"} component={Contact} options={{headerTitle: "Bạn bè", headerTitleAlign: 'center'}} />
        <Tab.Screen name={"Search"} component={Search} options={{headerTitle: "Tìm kiếm", headerTitleAlign: "center"}} />
        <Tab.Screen options={{headerTitle: "Thông báo", headerTitleAlign: "center"}} name={"Notifications"} component={Notifications}  />
        <Tab.Screen options={{tabBarLabel: ()=> null, headerTitle: "Cá nhân", headerTitleAlign: "center"}} name={"Me"} component={Me} />
      </Tab.Navigator>
      <PopupDialog
        width={0.5}
        visible={newChat}
        onTouchOutside={() => closeNewChat()}
        dialogAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
      >
        <View style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
          <TouchableHighlight>
            <Text style={{paddingTop: 10, paddingBottom: 10, fontSize: 17}}>Tạo liên hệ mới</Text>
          </TouchableHighlight>
          <Text style={{paddingTop: 10, paddingBottom: 10, fontSize: 17}}>Tạo nhóm mới</Text>
        </View>
      </PopupDialog>
    </>
  )
}
