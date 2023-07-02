import React, { useContext, useState } from 'react'
import { Button, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Background from '../Background/Background'
import Icons from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../AuthContainer/AuthContainer';
import login from '../../api/login';
import { useNavigation } from '@react-navigation/native';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { StyleSheet } from 'react-native';

const Login = () => {
  const navigation= useNavigation()
  const {setData, setAuth }= useContext(AuthContext)
  const [phoneNumber, setPhoneNumber]= useState("")
  const [password, setPassword]= useState("")
  const [isLogin, setIsLogin]= useState(false)
  const [dataLogin, setDataLogin]= useState()
  const closePopup= ()=> {
    setIsLogin(false)
  }
  return (
    <View style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative"}}>
      <Background />
      <View style={{width: "100%", padding: 10, marginTop: 12}}>
        <Text style={{textAlign: "center", marginBottom: 8, fontSize: 24}}>Đăng nhập tài khoản Chat NPD</Text>
        <Text style={{textAlign: "center", marginBottom: 16, fontSize: 24}}>để kết nối với ứng dụng</Text>
        <View style={{width: '100%', backgroundColor: "#fff", borderRadius: 10}}>
          <View style={{width: "100%", padding: 10, backgroundColor: "#fff", borderRadius: 10, position: "relative", marginBottom: 12}}>
            <TextInput value={phoneNumber} onChangeText={setPhoneNumber} placeholder={"Số điện thoại"} style={{width: "100%", height: 50, borderRadius: 10, borderWidth: 1, borderStyle: "solid", borderColor: "#e7e7e7", padding: 10, paddingLeft: 32, fontSize: 17}} />
            <Icons name={"phone"} size={18} style={{position: "absolute", top: 25, left: 20}} />
          </View>
          <View style={{width: "100%", padding: 10, backgroundColor: "#fff", borderRadius: 10, position: "relative", marginBottom: 12}}>
            <TextInput value={password} onChangeText={setPassword} placeholder={"Mật khẩu"} secureTextEntry={true} style={{width: "100%", height: 50, borderRadius: 10, borderWidth: 1, borderStyle: "solid", borderColor: "#e7e7e7", padding: 10, paddingLeft: 32, fontSize: 17}} />
            <Icons name={"lock"} size={18} style={{position: "absolute", top: 25, left: 20}} />
          </View>
          <View style={{padding: 10}}>
            {
              Platform.OS=== "android" && 
              <Button onPress={async ()=> {
                const result= await login(phoneNumber, password, setData, setAuth)
                if(result?.login !== true) {
                  setDataLogin(result)
                  setIsLogin(true)
                }
                else {
                  navigation.navigate("Tab", {headerTitle: "Đoạn Chat"})
                }
              }} color={"#2e89ff"} title={"Đăng nhập"} />
            }
            {
              Platform.OS=== "ios" &&
              <TouchableOpacity
      style={styles.button}
      activeOpacity={0.8}
      onPress={async ()=> {
                const result= await login(phoneNumber, password, setData, setAuth)
                if(result?.login !== true) {
                  setDataLogin(result)
                  setIsLogin(true)
                }
                else {
                  navigation.navigate("Tab", {headerTitle: "Đoạn Chat"})
                }
              }}
    >
      <Text style={styles.buttonText}>Đăng nhập</Text>
    </TouchableOpacity>
            }
            </View>
          <View style={{width: "100%", direction: "rtl", padding: 10}}>
            <Text style={{fontSize: 14, textAlign: "right"}}>Quên mật khẩu</Text>
          </View>
          <View style={{marginTop: 18, padding: 10}}>
            <View style={{width: "100%", borderTopColor: "#e7e7e7", borderStyle: "solid", borderTopWidth: 1, padding: 10, borderBottomColor: "#e7e7e7", borderBottomWidth: 1}}>
              <Text onPress={()=> navigation.navigate("Signup")} style={{textAlign: "center", textDecorationStyle: "solid", textDecorationLine: "underline", textDecorationColor: "#000", color: "#000"}}>Đăng ký</Text>
            </View>
          </View>
        </View>
      </View>
      {

      }
      <PopupDialog
        width={0.5}
        visible={isLogin}
        onTouchOutside={() => closePopup()}
        dialogAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
      >
        <View style={{padding: 10}}>
          <Text style={{textAlign: "center", fontSize: 17}}>{dataLogin?.msg}</Text>
          <Button onPress={()=> closePopup()} title={"Đóng"} />
        </View>
      </PopupDialog>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2e89ff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default Login