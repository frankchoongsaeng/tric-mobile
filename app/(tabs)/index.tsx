import { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, FlatList, Platform, TextInput, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import debounce from 'lodash/debounce'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { useTricThemeColor } from '@/hooks/useThemeColor'
import Feather from '@expo/vector-icons/Feather'
import * as Location from 'expo-location'
import MapComponent from '@/components/ui/MapComponent'
import axios from 'axios'

interface PlacePrediction {
    formattedAddress: string
    displayName: {
        text: string
        languageCode: string
    }
    id: string
}

let whichLocation: 'pickup' | 'dropoff' | null = null
const CURRENT_LOCATION = 'Current location'

class GoogleClient {
    private apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    async textSearch(textQuery: string): Promise<{ places: PlacePrediction[] }> {
        const res = await axios.post(
            'https://places.googleapis.com/v1/places:searchText',
            { textQuery },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': this.apiKey,
                    'X-Goog-FieldMask': 'places.formattedAddress,places.id,places.displayName'
                }
            }
        )
        const data = res.data
        console.log('text search response:', JSON.stringify(data))
        return data
    }
}

const googleClient = new GoogleClient('AIzaSyC2pDpDc1HXVEj_7pjrN1BjIzS4sCYXggU')

export default function HomeScreen() {
    const [price, setPrice] = useState('0.00')
    const [isLoading, setIsLoading] = useState(false)
    const [packageSize, setPackageSize] = useState('Small')
    const [pickupLocationSearch, setPickupLocationSearch] = useState('')
    const [pickupLocation, setPickupLocation] = useState<{ lng: number; lat: number } | null>(null)
    const [dropOffLocationSearch, setDropOffLocationSearch] = useState('')
    const [dropOffLocation, setDropOffLocation] = useState<{ lng: number; lat: number } | null>(null)
    const [predictions, setPredictions] = useState<PlacePrediction[]>([])
    const [lastSelectedPlace, setLastSelectedPlace] = useState<PlacePrediction | null>(null)
    const [currentLocation, setCurrentLocation] = useState<{ lng: number; lat: number } | null>(null)

    const styles = useStyles()

    const predictionsWithCurrentLocation = (): PlacePrediction[] => {
        return [
            {
                formattedAddress: CURRENT_LOCATION,
                id: CURRENT_LOCATION,
                displayName: {
                    languageCode: 'en',
                    text: CURRENT_LOCATION
                }
            },
            ...predictions
        ]
    }

    const searchPlaces = async (query: string) => {
        if (!query) {
            setPredictions([])
            return
        }

        try {
            // const response = await googleClient.textSearch(query)
            const data = await googleClient.textSearch(query)
            if (data.places) {
                if (data.places.length > 0) {
                    console.log('top prediction:', JSON.stringify(data.places[0]))
                }
                setPredictions(data.places)
            }
            console.log('query:', query, ', predictions:', data.places.length)
        } catch (error) {
            console.error('Error fetching places:', error)
            alert('Error fetching places')
        }
    }

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            alert('Permission to access location was denied')
            return
        }

        await Location.getCurrentPositionAsync({})
            .then(loc => {
                setPickupLocationSearch(CURRENT_LOCATION)
                setPickupLocation({
                    lng: loc.coords.longitude,
                    lat: loc.coords.latitude
                })
                console.log(loc.coords)
            })
            .catch(err => {
                console.log(err)
                alert('Unable to get current location')
            })
    }

    const handlePickupLocationSearchChange = async (text: string) => {
        setPickupLocationSearch(text)
        whichLocation = 'pickup'

        if (text !== '' && text !== CURRENT_LOCATION) {
            // set the location to the current location
            debouncedSearch(pickupLocationSearch)
        } else if (text === CURRENT_LOCATION) {
            if (currentLocation === null) {
                await getCurrentLocation()
            }

            if (currentLocation !== null) {
                console.log('current location is not null')
                setPickupLocationSearch(CURRENT_LOCATION)
                setPickupLocation(currentLocation)
                setPredictions([])
            } else {
                console.log('current location is null')
                setPickupLocationSearch('')
                setPickupLocation(null)
            }
        } else {
            whichLocation = null
            setPredictions([])
        }
    }

    const handlePlaceSelect = (place: PlacePrediction) => {
        if (whichLocation === 'pickup') {
            setPickupLocationSearch(place.formattedAddress)
        } else if (whichLocation === 'dropoff') {
            setDropOffLocationSearch(place.formattedAddress)
        }

        setLastSelectedPlace(place)
    }

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            searchPlaces(query)
        }, 500),
        []
    )

    // trigger a search when the pickup location search input changes
    useEffect(() => {
        if (pickupLocationSearch !== CURRENT_LOCATION) {
            debouncedSearch(pickupLocationSearch)
        }
    }, [pickupLocationSearch])

    // get current location
    useEffect(() => {
        getCurrentLocation()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.formSection}>
                <Text style={styles.title}>Calculate Delivery price</Text>
                <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 8 }}>
                    <View style={styles.inputsContainer}>
                        <View style={styles.inputWrapper}>
                            <IconSymbol name='location-searching' style={styles.inputIcon} size={24} color='#333' />
                            <TextInput
                                style={{ ...styles.locationInputs, borderBottomWidth: 0.5, borderColor: '#E5E5E5' }}
                                placeholder='Pick up point'
                                placeholderTextColor='#999'
                                value={pickupLocationSearch}
                                onChangeText={handlePickupLocationSearchChange}
                                onFocus={() => {
                                    setPredictions([])
                                    handlePickupLocationSearchChange(pickupLocationSearch)
                                }}
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Feather name='search' style={styles.inputIcon} size={24} color='#333' />

                            <TextInput
                                style={styles.locationInputs}
                                placeholder='Drop off location'
                                placeholderTextColor='#999'
                            />
                        </View>
                    </View>
                    <View>
                        <IconSymbol
                            name='location-searching'
                            style={{ ...styles.inputIcon, opacity: 0 }}
                            size={24}
                            color=''
                        />
                        <TouchableOpacity>
                            <IconSymbol name='swap-vert' style={styles.inputIcon} size={24} color='#333' />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* PREDICTIONS LIST */}
            <View style={styles.dropdownContainer}>
                <FlatList
                    data={predictionsWithCurrentLocation()}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) =>
                        item.id === CURRENT_LOCATION ? (
                            <TouchableOpacity style={styles.predictionItem} onPress={() => handlePlaceSelect(item)}>
                                <IconSymbol
                                    name='location-searching'
                                    style={styles.predictionIcon}
                                    size={16}
                                    color='#333'
                                />
                                <Text style={styles.predictionDisplayName}>{CURRENT_LOCATION}</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.predictionItem} onPress={() => handlePlaceSelect(item)}>
                                <Image source={require('@/assets/images/map-icon.png')} style={styles.predictionIcon} />
                                <View>
                                    <Text style={styles.predictionDisplayName}>{item.displayName.text}</Text>
                                    <Text style={styles.predictionAddress}>{item.formattedAddress}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    nestedScrollEnabled
                />
            </View>

            {/* <MapComponent></MapComponent> */}
        </SafeAreaView>
    )
}

function useStyles() {
    const tricTheme = useTricThemeColor()

    return StyleSheet.create({
        logo: {
            width: 80,
            height: 40,
            marginBottom: 20
        },
        title: {
            color: tricTheme.bodyText,
            fontSize: 18,
            fontWeight: '600',
            lineHeight: 40,
            textAlign: 'center'
        },
        formSection: {
            flexShrink: 0,
            backgroundColor: tricTheme.bodyBackground,
            padding: 16,
            paddingTop: 8
        },
        label: {
            fontSize: 16,
            fontWeight: '500',
            color: '#333',
            marginBottom: 4
        },
        inputsContainer: {
            borderWidth: 2,
            borderColor: tricTheme.primary,
            borderRadius: 12,
            overflow: 'hidden',
            paddingEnd: 12,
            flex: 1
        },
        inputWrapper: {
            fontSize: 16,
            color: tricTheme.bodyText,
            flexDirection: 'row',
            alignItems: 'center'
        },
        locationInputs: {
            flex: 1,
            paddingVertical: 12,
            fontSize: 16
        },
        inputIcon: {
            padding: 8,
            paddingHorizontal: 12,
            justifyContent: 'center',
            alignItems: 'center'
        },
        chevronIcon: {
            width: 20,
            height: 20
        },
        checkButton: {
            backgroundColor: '#0066FF',
            borderRadius: 100,
            padding: 16,
            alignItems: 'center',
            marginTop: 8
        },
        loadingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8
        },
        loadingIcon: {
            width: 20,
            height: 20
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '500'
        },
        priceContainer: {
            backgroundColor: '#F8F9FA',
            padding: 16,
            borderRadius: 12,
            marginTop: 8
        },
        priceLabel: {
            fontSize: 16,
            color: '#333'
            // marginBottom: 4
        },
        priceValue: {
            // fontSize: 40,
            fontWeight: '500',
            color: '#333'
        },
        dropdownContainer: {
            flex: 1,
            backgroundColor: '#fff'
        },
        predictionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16
        },
        predictionIcon: {
            width: 16,
            height: 16,
            marginRight: 12
        },
        predictionAddress: {
            flex: 1,
            fontSize: 14,
            color: tricTheme.darkGrey
        },
        predictionDisplayName: {
            flex: 1,
            fontSize: 16,
            fontWeight: '500',
            color: tricTheme.bodyText
        },
        separator: {
            height: 1,
            backgroundColor: '#E5E5E5',
            marginHorizontal: 16
        }
    })
}
