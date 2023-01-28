import { View, Text, Platform, PermissionsAndroid } from 'react-native';
import React, { useState } from 'react';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import { BleManager, Device, Service } from 'react-native-ble-plx';

const manager = new BleManager();

type VoidCallback = (result: boolean) => void;

interface BluetoothLowEnergyApi {
    requestPermissions(cb: VoidCallback): Promise<void>;
    scanForDevices(): void;
    allDevices: Device[];
    connectedDevice: Device | null;
    connectToDevice: (deviceId: Device) => Promise<void>;
    disconnectFromDevice: () => void
}

function useBle() : BluetoothLowEnergyApi {


    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    const requestPermissions = async (cb: VoidCallback) => {
        if(Platform.OS === 'android') {
            const apiLevel = await DeviceInfo.getApiLevel();

            if(apiLevel < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                        title: 'Location Permission',
                        message: 'Bluetooth Low Energy requires Location',
                        buttonNeutral: 'Ask Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                cb(granted === PermissionsAndroid.RESULTS.GRANTED);
            } else {
                const result = await requestMultiple([
                    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ]);

                const isGranted = result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED && result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED && result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;

                cb(isGranted);
            }
        } else {
            cb(true);
        }
    };

    const isDuplicateDevice = (devices: Device[], nextDevice: Device) => devices.findIndex(device => nextDevice.localName === device.localName) > -1;

    const scanForDevices = () => manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            console.log(error);
        };
        if ( device) {
            setAllDevices(prevState => {
                if (!isDuplicateDevice(prevState, device)) {
                    return [...prevState, device]
                }
                return prevState
            });
        }
    });

    const connectToDevice = async (device: Device) => {
        try {
            const deviceConnection = await manager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            //const deviceBluetooh = await manager.servicesForDevice(device.id)
            await deviceConnection.discoverAllServicesAndCharacteristics();
            console.log('Estas CONECTADO', await deviceConnection.characteristicsForService('0000ffe0-0000-1000-8000-00805f9b34fb'))
            
            //console.log('descriptorsForService: ', await deviceConnection.descriptorsForService("0000ffe0-0000-1000-8000-00805f9b34fb", ))
            manager.stopDeviceScan();
        } catch (error) {
            console.log('Falla al conectarse', error)
        }
    };

    const disconnectFromDevice = () => {
        if (connectedDevice) {
            manager.cancelDeviceConnection(connectedDevice.id);
            setConnectedDevice(null);
        }
    };

    return {
        requestPermissions,
        scanForDevices,
        allDevices,
        connectToDevice,
        disconnectFromDevice,
        connectedDevice
    }
}

export default useBle