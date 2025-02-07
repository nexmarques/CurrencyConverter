import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Keyboard } from 'react-native';
import PickerItem from './src/Picker';
import api from './src/services/api';


export default function App() {

  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [currencySelected, setCurrencySelected] = useState(null)
  const [convertedValue, setConvertedValue] = useState(0)
  const [value, setValue] = useState(null)      

  useEffect(() => {
    async function loadCurrency() {
      const response = await api.get('all');
      let currencyArray = [];

      Object.keys(response.data).map((key) => (
        currencyArray.push({
          label: key,
          key: key,
          value: key
        })
      ))
      setCurrencies(currencyArray)
      setCurrencySelected(currencyArray[0].key)

    }
    loadCurrency()
    setLoading(false)
  }, [])  

  async function convertingValue(){
    if( value === 0 || value === "" || value == null ){ 
      Alert.alert('Error', 'Please enter a value to convert')              
      return;
    }
    const response = await api.get(`/all/${currencySelected}-BRL`) 
    let result = (response.data[currencySelected].ask * parseFloat(value)) 
    setConvertedValue(result)  
    Keyboard.dismiss() 

  }

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <Text style={styles.txtLoading} > Loading... </Text>
        <ActivityIndicator
          size='large'
          color="#fff"
        />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.viewCurrency} >
        <Text style={styles.title} > Select your currency </Text>
        <PickerItem
          currencies={currencies}
          selected={currencySelected}
          onChange={(currency) =>  setCurrencySelected(currency) }                    
        />

        <Text style={styles.txt} > Enter an amount to convert to (R$)</Text>
        <TextInput
          value={value}
          onChangeText={(value) => setValue(value)}
          keyboardType='numeric'
          style={styles.input}
          placeholder='EX: 1.60'
        />
        <TouchableOpacity style={styles.btn} onPress={ convertingValue } >
          <Text style={styles.txtBtn} > Convert  </Text>
        </TouchableOpacity>
      </View>

      {convertedValue !== 0 && (
        <View style={styles.result} >
        <Text style={styles.resultTxt}  > {value} {currencySelected} </Text>
        <Text style={styles.resultTxt} > Corresponds to </Text>
        <Text style={styles.resultTxt} > { convertedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) } </Text>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    alignItems: 'center',
  },
  viewCurrency: {
    marginTop: 35,
    width: '95%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    paddingTop: 10,
    paddingLeft: 5,
    color: '#000',
    fontWeight: '500',
  },
  btn: {
    backgroundColor: '#fb4b57',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,    
  },
  txtBtn: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    padding: 5,
    fontWeight: 'bold'
  },
  input: {
    padding: 5,
    marginTop: 5,
    marginLeft: 5,
    fontSize: 20,
    marginBottom: 10,
    color: '#000'
  },
  result: {
    marginTop: 30,
    width: '95%',
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultTxt: {
    fontSize: 30,
    color: '#000'
  },
  txt: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',   
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101215'
  },
  txtLoading: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8
  }
});