import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, Dimensions, Alert } from 'react-native'
import MapView, { Marker, Region } from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { Stack } from 'expo-router'
import * as Location from 'expo-location'

interface LocationData {
    latitude: number
    longitude: number
}

const LocationSelectScreen = () => {
    const [pickupLocation, setPickupLocation] = useState<LocationData | null>(null)
    const [dropoffLocation, setDropoffLocation] = useState<LocationData | null>(null)
    const mapRef = useRef<MapView | null>(null)

    const initialRegion: Region = {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    }

    useEffect(() => {
        ;(async () => {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Please allow location access to use this feature.')
                return
            }

            const location = await Location.getCurrentPositionAsync({})
            const currentLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
            setPickupLocation(currentLocation)
            mapRef.current?.animateToRegion({
                ...currentLocation,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            })
        })()
    }, [])

    const handlePickupSelect = (_data: any, details: any) => {
        if (!details?.geometry?.location) return

        const location: LocationData = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng
        }
        setPickupLocation(location)
        mapRef.current?.animateToRegion({
            ...location,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        })
    }

    const handleDropoffSelect = (_data: any, details: any) => {
        if (!details?.geometry?.location) return

        const location: LocationData = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng
        }
        setDropoffLocation(location)
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Select Location',
                    headerStyle: {
                        backgroundColor: '#1a1b1e'
                    },
                    headerTintColor: '#fff'
                }}
            />

            <View style={styles.searchContainer}>
                <GooglePlacesAutocomplete
                    placeholder='Enter pickup location'
                    onPress={handlePickupSelect}
                    fetchDetails={true}
                    query={{
                        key: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your API key
                        language: 'en'
                    }}
                    styles={{
                        container: styles.autocompleteContainer,
                        textInput: styles.textInput,
                        listView: styles.listView
                    }}
                />
                <GooglePlacesAutocomplete
                    placeholder='Enter dropoff location'
                    onPress={handleDropoffSelect}
                    fetchDetails={true}
                    query={{
                        key: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your API key
                        language: 'en'
                    }}
                    styles={{
                        container: styles.autocompleteContainer,
                        textInput: styles.textInput,
                        listView: styles.listView
                    }}
                />
            </View>

            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {pickupLocation && <Marker coordinate={pickupLocation} title='Pickup Location' pinColor='green' />}
                {dropoffLocation && <Marker coordinate={dropoffLocation} title='Dropoff Location' pinColor='red' />}
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1b1e'
    },
    searchContainer: {
        position: 'absolute',
        width: '100%',
        zIndex: 1,
        padding: 10,
        gap: 10
    },
    autocompleteContainer: {
        flex: 0,
        backgroundColor: '#1a1b1e'
    },
    textInput: {
        backgroundColor: '#2c2e33',
        color: '#fff',
        fontSize: 16,
        borderRadius: 8,
        height: 50
    },
    listView: {
        backgroundColor: '#2c2e33',
        borderRadius: 8,
        marginTop: 5
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
})

export default LocationSelectScreen
