import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Trash from './trash';
import HomeScreen from './index';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    //     headerShown: false,
    //     tabBarButton: HapticTab,
    //     tabBarBackground: TabBarBackground,

    //     tabBarStyle: Platform.select({
    //       android: {
    //         // display: 'none',
    //       },
    //       ios: {
    //         // Use a transparent background on iOS to show the blur effect
    //         position: 'absolute',

    //       },
    //       default: {},
    //     }),
    //   }}>
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: 'Home',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="explore"
    //     options={{
    //       title: 'Explore',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
    //     }}
    //   />
    // </Tabs>

    <Drawer.Navigator initialRouteName="Home"
      screenOptions={{
        swipeEnabled: true,
        swipeEdgeWidth: 400,
        drawerActiveTintColor: 'white',   // لون النص للعنصر المختار
        drawerInactiveTintColor: 'rgba(0, 0, 0, 0.7)',    // لون النص للعناصر العادية
        drawerActiveBackgroundColor: '#0c0c0c', // خلفية العنصر المختار
        drawerItemStyle: {
          borderRadius: 7,
          // height:50
        },
        drawerLabelStyle: {
          fontSize: 18,
          fontWeight: '500',
        },
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Trash" component={Trash} />
    </Drawer.Navigator>
  );
}
