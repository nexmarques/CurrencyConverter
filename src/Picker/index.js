import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";


export default function PickerItem(props) {

  let items = props.currencies.map( (item, index) => {
    return(
      <PickerItem key={index} value={item.key} label={item.key} />
    )
  } );
  
  return (
    <Picker
      selectedValue={props.selected}
      onValueChange={ (value) => props.onChange(value) }
    >
      {items}
    </Picker>
  )
}