import { 
  Text, 
  SafeAreaView, 
  View, 
  Pressable, 
  StyleSheet, 
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import useBle from '../hooks/useBle';
import DispositivosConectados from '../components/DispositivosConectados';

const  Navigation = () => {

  const {scanForDevices, allDevices, requestPermissions, connectToDevice} = useBle();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = async () => {
    bluetoohScan()
    //setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const bluetoohScan = () => {
    requestPermissions(isGranted => {
      if(isGranted) {
        scanForDevices();
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pcConnectTextContainer}>
        <Text style={styles.blankTextTitle}>Por favor conecta algún dispositivo</Text>
        {allDevices ? 
          <FlatList 
            data={allDevices}
            keyExtractor={(item, index) => String(index)}
            renderItem={({item}) => 
                        <>
                          <Text>Dispositivo</Text>
                          <Text>Name: {item.name}</Text> 
                          <Text>Id: {item.id}</Text>
                          <Text>localName: {item.localName}</Text>
                          
                        </>  
                       }
            contentContainerStyle={styles.flatlistContiner}
          /> 
        : null}
      </View>
      <Pressable style={styles.ctaButton} onPress={showModal}>
        <Text style={styles.connectButton}>Conectar!</Text>
      </Pressable>
      {/* <DispositivosConectados 
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      /> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  pcConnectTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blankTextTitle: {
    marginHorizontal: 22,
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: 'purple',
    height: 48,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
    justifyContent: 'center',
  },
  connectButton: {
    color: 'white',
    textAlign: 'center',
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 9,
  },
  flatlistContiner: {
    flex: 1,
    justifyContent: 'center',
  },
})

export default Navigation