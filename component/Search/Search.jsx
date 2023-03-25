import React, { useContext, useEffect, useState } from 'react'
import { FlatList, ScrollView, TextInput, View } from 'react-native'
import Fuse from "fuse.js"
import { useIsFocused } from '@react-navigation/native'
import get_list_conversation from '../../api/conversation/get_list_conversation'
import { AuthContext } from '../AuthContainer/AuthContainer'
import { Item } from '../Chats/Chats'

const Search = () => {
  const isFocused= useIsFocused()
  const {data }= useContext(AuthContext)
  const [result, setResult]= useState([])
  const [querySearch, setQuerySearch]= useState("")
  const options = {
    keys: [
        { name: 'label', getFn: (book) => book.label },
        { name: 'username', getFn: (book) => book.member?.map(item=> item.username) }
      ]
  };
  useEffect(()=> {
    get_list_conversation(setResult, data?.user?._id, data?.accessToken)
  }, [isFocused])
  
  const fuse = new Fuse(result, options);
  return (
    <ScrollView>
      <View style={{marginTop: 12, width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <TextInput value={querySearch} onChangeText={setQuerySearch} style={{width: "100%", height: 40, borderRadius: 80, borderWidth: 1, borderStyle: "solid", borderColor: "#2e89ff", padding: 10, backgroundColor: "#fff"}} placeholder={"Tìm kiếm cuộc trò chuyện"} />
        <View style={{width: '100%', marginTop: 12}}>
          <FlatList data={fuse.search(querySearch)} renderItem={({item, index, separators})=> <Item {...item.item} key={index} idUser={data?.user?._id} />} />
        </View>
      </View>
    </ScrollView>
  )
}

export default Search