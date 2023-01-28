import { Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { Device } from 'react-native-ble-plx';
import { useNavigation } from '@react-navigation/native';
import useBle from '../hooks/useBle';

interface Props {
    item: Device
};

interface DeviceDetails {
    navigate: any
};

const DeviceList = ({item} : Props) => {

    const {connectToDevice} = useBle()

    const navigation = useNavigation<DeviceDetails>();

    const goToDeviceDetails = () => {
        connectToDevice(item)
    }

    return (
        <Pressable style={styles.containerDeviceList} onPress={goToDeviceDetails}>
            <Text style={styles.textDeviceList}>ID: {item.id}</Text>
            <Text style={styles.textDeviceList}>Name: {item.name}</Text>
            <Text style={styles.textDeviceList}>localName: {item.localName}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    containerDeviceList: {
        backgroundColor: 'purple',
        borderRadius: 8,
        marginBottom: 5
    },
    textDeviceList: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5
    }
});

export default DeviceList