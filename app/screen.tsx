import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, TextInput, Switch, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const DummyScreen = () => {
    const [inputText, setInputText] = useState('')
    const [isEnabled, setIsEnabled] = useState(false)
    const [selectedTab, setSelectedTab] = useState('home')

    const dummyItems = [
        { id: 1, title: 'Item 1', description: 'Description for item 1' },
        { id: 2, title: 'Item 2', description: 'Description for item 2' },
        { id: 3, title: 'Item 3', description: 'Description for item 3' }
    ]

    const handleButtonPress = () => {
        Alert.alert('Button Pressed', 'You clicked the button!')
    }

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState)
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Dummy Screen</Text>
                    <TouchableOpacity onPress={handleButtonPress}>
                        <Text style={styles.headerButton}>Settings</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Section */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Search here...'
                        value={inputText}
                        onChangeText={setInputText}
                    />
                </View>

                {/* Toggle Section */}
                <View style={styles.toggleContainer}>
                    <Text>Enable Feature</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>

                {/* List Section */}
                <View style={styles.listContainer}>
                    {dummyItems.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.listItem}
                            onPress={() => Alert.alert(item.title, item.description)}
                        >
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemDescription}>{item.description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bottom Tabs */}
                <View style={styles.tabBar}>
                    {['home', 'search', 'profile'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, selectedTab === tab && styles.selectedTab]}
                            onPress={() => setSelectedTab(tab)}
                        >
                            <Text style={styles.tabText}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f8f8'
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    headerButton: {
        color: '#007AFF'
    },
    searchContainer: {
        padding: 16
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f5f5f5'
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    listContainer: {
        padding: 16
    },
    listItem: {
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 12
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4
    },
    itemDescription: {
        color: '#666'
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingVertical: 12
    },
    tab: {
        padding: 8,
        borderRadius: 16
    },
    selectedTab: {
        backgroundColor: '#e3e3e3'
    },
    tabText: {
        color: '#333'
    }
})

export default DummyScreen
