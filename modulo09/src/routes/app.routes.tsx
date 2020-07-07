import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import CreateAppointment from '../pages/CreateAppointment';
import AppointmentCreated from '../pages/AppointmentCreated';

const AppStack = createStackNavigator();

const AppRoutes: React.FC = () => {
  return (
    <AppStack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#312e38' },
      }}
    >
      {/* appointment */}
      <AppStack.Screen name="Dashboard" component={Dashboard} />
      <AppStack.Screen name="CreateAppointment" component={CreateAppointment} />
      <AppStack.Screen
        name="AppointmentCreated"
        component={AppointmentCreated}
      />

      {/* user */}
      <AppStack.Screen name="Profile" component={Profile} />
    </AppStack.Navigator>
  );
};

export default AppRoutes;
