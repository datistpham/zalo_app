import React from 'react'
import { Image, View } from 'react-native'

const Background = () => {
  return (
    <View style={{width: '100%', height: '100%', display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", top: 0, left: 0}}>
        <Image style={{width: '100%', height: '100%'}} source={{uri: "https://res.cloudinary.com/cockbook/image/upload/v1673758594/single/Mediamodifier-Design-Template_xs7g1e.jpg"}} />
    </View>
  )
}

export default Background