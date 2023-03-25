import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Image, Text, View, Switch, Button, TouchableHighlight, TextInput,KeyboardAvoidingView, ScrollView, } from 'react-native'
import { AuthContext } from '../AuthContainer/AuthContainer'
import ActionSheet from "react-native-actions-sheet";
import Icons from 'react-native-vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';
import upload_image from '../../api/upload_image';
import update_info_user from '../../api/update_info_user';
import { Snackbar } from 'react-native-paper';
import deaf_user from '../../api/user/deaf_user';

const Me = () => {
  const isFocused= useIsFocused()
  const actionSheetRef = useRef(null)
  const {data, setAuth, setData }= useContext(AuthContext)
  const navigation= useNavigation()
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState)
    deaf_user(!isEnabled, data?.user?._id, data?.accessToken)
    setData((prev)=> ({...prev, user: {...data?.user, isDeaf: !isEnabled}}))
  };
  const [resultImage, setResultImage]= useState()
  const [profilePicture, setProfilePicture]= useState("")
  const [gender, setGender]= useState("")
  const toggleGender = () => setGender(previousState => !previousState);

  const [username, setUsername]= useState("")
  useEffect(()=> {
    setProfilePicture(()=> data?.user?.profilePicture)
    setGender(()=> data?.user?.gender)
    setUsername(()=> data?.user?.username)
    setIsEnabled(()=> data?.user?.isDeaf)
  }, [data, isFocused])
  const chooseImageFunction= ()=> {
    DocumentPicker.getDocumentAsync()
    .then(async res=> {
        // const fileUri= res.uri
        const formData= new FormData()
        formData.append("image", {...res, type: "image/jpeg"})
        const result= await upload_image(formData)
        setResultImage(result)
        const result1= await update_info_user(data?.user?._id, username, gender, result?.secure_url, data?.accessToken)
        setData(prev=> ({...prev, user: {...data?.user, profilePicture: result.secure_url}}))
        setVisible(()=> true)
    })
    .catch(err=> setResultImage(err))
  }
  const [visible, setVisible] = useState(false);

  const onDismissSnackBar = () => setVisible(false);
  return (
    <ScrollView>
        <View style={{width: "100%"}}>
          <Image style={{width: "100%", aspectRatio: 5 / 2}} source={{uri: "https://cover-talk.zadn.vn/default"}} />
        </View>
        <View style={{width: "100%", position: "relative", display: "flex", justifyContent: "center", alignItems: 'center'}}>
          <View style={{position: "relative", top: -60}}>
            <Image style={{width: 120, height: 120, borderRadius: 60, marginBottom: 12}} source={{uri: data?.user?.profilePicture}} />
            <Text style={{fontSize: 18, textAlign: 'center'}}>{data?.user?.username}</Text>
          </View>
        </View>
        <View style={{width: "100%", padding: 10}}>
          <View style={{width: "100%", padding: 10, backgroundColor: "#fff", borderRadius: 10}}>
            <Text style={{marginBottom: 12, fontSize: 18, fontWeight: "600"}}>
              Thông tin cá nhân
            </Text>
            <Text style={{marginBottom: 12, fontSize: 18}}>Điện thoại: {data?.user?.phoneNumber}</Text>
            <Text style={{marginBottom: 24, fontSize: 18}}>Giới tính: {data?.user?.gender=== true ? "Nam" : "Nữ"}</Text>
            <Text style={{marginBottom: 12, fontSize: 18, fontWeight: "600"}}>
              Nâng cao
            </Text>
            <View style={{marginBottom: 12, width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", flexDirection: "row"}}>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
              <Text style={{marginLeft: 12, fontSize: 18}}>Chế độ giành cho người câm</Text>
            </View>
            <View style={{width: "100%", marginBottom: 24}}>
              <Button  color={"#2e89ff"} title={"Cập nhật thông tin"} onPress={()=> actionSheetRef.current?.show()} />
            </View>
            <View style={{width: "100%", marginBottom: 12}}>
              <Button color={"#2e89ff"} title={"Đăng xuất"} onPress={()=> {
                setAuth(()=> false)
                navigation.navigate("Login")
              }} />
            </View>
          </View>
        </View>
          <ActionSheet ref={actionSheetRef}>
            <View style={{height: "100%"}}>
              <View style={{marginBottom: 12, padding: 10, display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexDirection: 'row'}}>
                  <View><Text style={{opacity: 0}}>Xongaaa</Text></View>
                  <TouchableHighlight underlayColor={"unset"} style={{display: "flex", justifyContent:"center", alignItems: "center"}}>
                    <Text style={{height: 5, width: 60, borderRadius: 5, backgroundColor: "#d9d9d9", textAlign: "center"}}></Text>
                  </TouchableHighlight>
                  <TouchableHighlight underlayColor={"unset"} onPress={()=> actionSheetRef.current?.hide()}>
                    <Text style={{padding: 10}}>Đóng</Text>
                  </TouchableHighlight>
              </View>
              <View style={{width: "100%"}}>
                <View style={{width: "100%"}}>
                  <Image style={{width: "100%", aspectRatio: 5 / 2}} source={{uri: "https://cover-talk.zadn.vn/default"}} />
                </View>
                <View style={{width: "100%", position: "relative", display: "flex", justifyContent: "center", alignItems: 'center'}}>
                  <View style={{position: "relative", top: -60}}>
                    <View style={{position: "relative"}}>
                      <Image style={{width: 120, height: 120, borderRadius: 60, marginBottom: 12}} source={{uri: data?.user?.profilePicture}} />
                      <Icons onPress={chooseImageFunction} style={{position: "absolute", right: 5, bottom: 5}} name={"camera-alt"} size={32} />
                    </View>
                    <Text style={{fontSize: 18, textAlign: 'center'}}>{data?.user?.username}</Text>
                  </View>
                </View>
                <View style={{padding: 10 }}>
                  <Text style={{fontSize: 17, marginBottom: 12}}>Tên người dùng</Text>
                  <TextInput value={username} onChangeText={setUsername} style={{width: "100%", height: 40, borderColor: "#2e89ff", backgroundColor: "#f2f0f5", borderWidth: 1, borderStyle: "solid", borderRadius: 10, padding: 10, fontSize: 17, marginBottom: 18}} />
                  <Text style={{fontSize: 18, fontWeight: "600", marginBottom: 12}}>Thông tin cá nhân</Text>
                  <Text>Giới tính</Text>
                  <View style={{marginBottom: 12, width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", flexDirection: "row"}}>
                    <Text style={{marginRight: 12}}>Nữ</Text>
                    <Switch
                      trackColor={{false: '#767577', true: '#81b0ff'}}
                      thumbColor={gender ? '#fff' : '#f4f3f4'}
                      onValueChange={toggleGender}
                      value={gender}
                    />
                    <Text style={{marginLeft: 12}}>Nam</Text>
                  </View>
                  <KeyboardAvoidingView behavior={"padding"}>
                    <>
                      <Text style={{fontSize: 17, marginBottom: 12}}>Địa chỉ</Text>
                      <TextInput value={""} onChangeText={()=> {}} style={{width: "100%", height: 40, borderColor: "#2e89ff", backgroundColor: "#f2f0f5", borderWidth: 1, borderStyle: "solid", borderRadius: 10, padding: 10, fontSize: 17, marginBottom: 18}} />
                    </>
                  </KeyboardAvoidingView>
                  <Button title={"Lưu"} onPress={()=> {}} />
                </View>
              </View>
              <Snackbar
                visible={visible}
                duration={2000}
                onDismiss={onDismissSnackBar}
                action={{
                  label: 'Close',
                  onPress: () => onDismissSnackBar,
                }}>
                  Cập nhật thông tin thành công
            </Snackbar>
            </View>
          </ActionSheet>
    </ScrollView>
  )
}

export default Me