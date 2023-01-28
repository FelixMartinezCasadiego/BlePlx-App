import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScanDevices from '../screens/ScanDevices';
import DeviceDetails from '../screens/DeviceDetails';

const Stack = createNativeStackNavigator()

const NavigationPrincipal = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen 
            name='Home'
            component={ScanDevices}
        />
        <Stack.Screen 
            name='DeviceDetails'
            component={DeviceDetails}
        />
    </Stack.Navigator>
  )
}

export default NavigationPrincipal