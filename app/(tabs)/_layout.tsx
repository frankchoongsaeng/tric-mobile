import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'

import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { TricColors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

export default function TabLayout() {
    const colorScheme = useColorScheme()

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: TricColors[colorScheme ?? 'light'].bodyText,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground
                // tabBarStyle: Platform.select({
                //     ios: {
                //         // Use a transparent background on iOS to show the blur effect
                //         // position: 'absolute'
                //     },
                //     default: {}
                // })
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Calculate',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name='calculate' color={color} />
                }}
            />
            <Tabs.Screen
                name='orders'
                options={{
                    title: 'Delivery',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name='receipt' color={color} />
                }}
            />
            <Tabs.Screen
                name='explore'
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name='supervised-user-circle' color={color} />
                }}
            />
        </Tabs>
    )
}
