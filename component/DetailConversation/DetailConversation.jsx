import { useRoute } from '@react-navigation/native'
import React, {createRef, forwardRef, memo, useContext, useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, FlatList, Image, TouchableHighlight, Button, SafeAreaView } from 'react-native'
import get_message_conversationid from '../../api/message/get_message_conversationid'
import { AuthContext } from '../AuthContainer/AuthContainer'
import Type from './Type'
import _ from "lodash"
import moment from 'moment'
import { SocketContainerContext } from '../SocketContainer/SocketContainer'
import remove_message from '../../api/message/remove_message'
import recall_message from '../../api/message/recall_message'
import { LogBox } from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign'
import RBSheet from 'react-native-raw-bottom-sheet'
// import WaveForm from 'react-native-audiowaveform'
import { Audio } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// import AboutDetailConversation from './AboutDetailConversation'

const DetailConversation = () => {
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, [])
  const insets= useSafeAreaInsets()
  const {socketState}= useContext(SocketContainerContext)
  const [result, setResult]= useState([])
  const {data }= useContext(AuthContext)
  const route= useRoute()
  const query= {
    page: 1, 
    limit: 9
  }
  useEffect(()=> {
    if(data?.accessToken) {
        get_message_conversationid(route.params.idConversation, setResult, data.accessToken, query)
    }
  }, [route.params, data])
  useEffect(() => {
    socketState.on("broadcast_to_all_user_in_room", (data) => {
      setResult((prev) => [...prev, data]);
    });
  }, [socketState]);
  return (
    <View style={{flex: 1, position: "relative", backgroundColor: "#fff"}}>
        <ContentConversation result={result} meId={data?.user?._id} socketState={socketState} />
        <Type />
        <View style={{height: 60 + insets.bottom}}>

        </View>
    </View>
  )
}

const ContentConversation= (props)=> {
    const scrollViewRef = useRef();
    const refBottom= useRef([])
    const {data }= useContext(AuthContext)
    refBottom.current = props?.result.map((element, i) => refBottom.current[i] ?? createRef());
    return (
        <View style={{flex: 1, display: "flex", backgroundColor: "#fff", position: "relative"}}>
            <ScrollView ref={scrollViewRef} onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd({ animated: true })}>
                <FlatList data={_.orderBy(props?.result, o=> moment(o.createdAt).valueOf(), 'asc')} renderItem={({item, index, separators})=> <ComponentMessage ref={refBottom.current[index]} socketState={props?.socketState} key={item?.key} {...item} keyId={item?.key} meId={props?.meId} accessToken={data.accessToken} />} />
            </ScrollView>
        </View>
    )
}

const ComponentMessage= memo(forwardRef((props, ref)=> {
    const route= useRoute()
    const [open, setOpen]= useState(false)
    const [reValue, setReValue]= useState(undefined)
    useEffect(()=> {
        props?.socketState?.on("recall_message_server", (data)=> {
            setReValue(data)
            recall_message(props?.keyId, data?.message, props?.accessToken)
        })
        props?.socketState?.on("remove_message_server", (data)=> {
            setReValue(data)
            remove_message(props?.keyId, data?.message, props?.accessToken)
        })
    }, [props?.socketState, props?.keyId])
    const recallMessage= ()=> {
        props?.socketState?.emit("recall_message", {idConversation: route.params?.idConversation, kindof: "recall", idMessage: props?._id, keyId: props?.keyId})
        ref.current.close()
        
    }

    const removeMessage= ()=> {
        props?.socketState?.emit("remove_message", {idConversation: route.params?.idConversation, kindof: "remove", idMessage: props?._id, keyId: props?.keyId})
        props?.socketState?.on("remove_message_server", (data)=> {
            setReValue(data)
            remove_message(props?.keyId, data?.message)
        })
        ref.current.close()
    }
    return (
        <TouchableHighlight underlayColor={"unset"}>
            <>
                <TouchableHighlight underlayColor={"unset"} onLongPress={()=> ref.current.open()}>
                    <View style={{width: "100%", padding: 16, display: "flex", flexDirection: props?.sender?._id === props?.meId ? "row-reverse" : "row"}}>
                        <Image style={{width: 50, height: 50, borderRadius: 25}} source={{uri: props?.sender?.profilePicture}} />
                        {props?.type_message=== "text" && <Text style={{marginLeft: 12, marginRight: 12, fontSize: 18, padding: 10, borderRadius: 10, backgroundColor:  props?.sender?._id === props?.meId ? "#2e89ff" : "#f2f0f5", color:  props?.sender?._id === props?.meId ? "#fff" : "#000"}}>{props?.message}</Text>}
                        {props?.type_message=== "image" && <Image style={{aspectRatio: 16 / 9, width: "75%", marginLeft: 12, marginRight: 12, borderRadius: 10}} source={{uri: props?.message}} />}
                        {props?.type_message=== "like" && <Icons style={{margin: 12}} name={"like1"} color={"#2e89ff"} size={48} />}
                        {props?.type_message=== "text_to_voice" && <AudioComponent message={props?.message} />}
                    </View>
                </TouchableHighlight>
                <RBSheet height={60} ref={ref}>
                    <View style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: 'row', padding: 10}}>
                        <Text onPress={recallMessage} style={{padding: 10, fontSize: 16}}>Thu hồi</Text>
                        <Text onPress={removeMessage} style={{padding: 10, fontSize: 16}}>Gỡ bỏ</Text>
                    </View>
                </RBSheet>
            </>
        </TouchableHighlight>
    )
})
)

const AudioComponent= memo((props)=> {
    async function playSound() {
        const { sound } = await Audio.Sound.createAsync({uri: props?.message});
        await sound.playAsync();
    }
    return (
        <>
            <Button title={"Play"} onPress={()=> playSound()} />
        </>
    )
})

export default DetailConversation