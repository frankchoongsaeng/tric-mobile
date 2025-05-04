import { StyleSheet, View, TouchableOpacity, Image, FlatList } from 'react-native'
import { TextInput, Text } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import debounce from 'lodash/debounce'
import MapComponent from '@/components/ui/MapComponent'
import { IconSymbol } from '@/components/ui/IconSymbol'

interface PlacePrediction {
    description: string
    place_id: string
}

export default function HomeScreen() {
    const [price, setPrice] = useState('0.00')
    const [isLoading, setIsLoading] = useState(false)
    const [packageSize, setPackageSize] = useState('Small')
    const [pickupLocation, setPickupLocation] = useState('')
    const [predictions, setPredictions] = useState<PlacePrediction[]>([])
    const [showPredictions, setShowPredictions] = useState(false)
    const [selectedPlace, setSelectedPlace] = useState<PlacePrediction | null>(null)

    const searchPlaces = async (query: string) => {
        if (!query) {
            console.log('No query')
            setPredictions([])
            return
        }

        console.log('Query', query)

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
                    query
                )}&key=AIzaSyC2pDpDc1HXVEj_7pjrN1BjIzS4sCYXggU&components=country:gh`
            )
            const data = await response.json()
            if (data.predictions) {
                setPredictions(data.predictions)
            }
        } catch (error) {
            console.error('Error fetching places:', error)
        }
    }

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            searchPlaces(query)
        }, 500),
        []
    )

    useEffect(() => {
        if (pickupLocation) {
            debouncedSearch(pickupLocation)
        } else {
            setPredictions([])
        }
    }, [pickupLocation, debouncedSearch])

    const handlePlaceSelect = (place: PlacePrediction) => {
        setPickupLocation(place.description)
        setSelectedPlace(place)
        setShowPredictions(false)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.formSection}>
                <Text style={styles.title}>Calculate Delivery price</Text>
                <View style={styles.inputsContainer}>
                    <View style={styles.inputWrapper}>
                        {/* <View style={styles.inputIcon}> */}
                        <IconSymbol name='location-searching' style={styles.inputIcon} size={24} color='#333' />
                        {/* </View> */}
                        <TextInput
                            style={{ ...styles.locationInputs, borderBottomWidth: 0.5, borderColor: '#E5E5E5' }}
                            placeholder='Pick up point 1'
                            placeholderTextColor='#999'
                            value={pickupLocation}
                            onChangeText={text => {
                                setPickupLocation(text)
                                setShowPredictions(true)
                            }}
                            onFocus={() => setShowPredictions(true)}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Image
                                source={require('@/assets/images/chevron-down-icon.png')}
                                style={styles.chevronIcon}
                            />
                        </View>
                        <TextInput
                            style={styles.locationInputs}
                            placeholder='Drop off location'
                            placeholderTextColor='#999'
                        />
                    </View>
                    {showPredictions && predictions.length > 0 && (
                        <View style={styles.dropdownContainer}>
                            <FlatList
                                data={predictions}
                                keyExtractor={item => item.place_id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.predictionItem}
                                        onPress={() => handlePlaceSelect(item)}
                                    >
                                        <Image
                                            source={require('@/assets/images/map-icon.png')}
                                            style={styles.predictionIcon}
                                        />
                                        <Text style={styles.predictionText}>{item.description}</Text>
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                nestedScrollEnabled
                            />
                        </View>
                    )}
                </View>
            </View>
            <MapComponent></MapComponent>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: 80,
        height: 40,
        marginBottom: 20
    },
    title: {
        color: '#333',
        lineHeight: 40,
        textAlign: 'center'
    },
    formSection: {
        flexShrink: 0,
        backgroundColor: '#fff',
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
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        overflow: 'hidden',
        paddingEnd: 12
    },
    inputWrapper: {
        fontSize: 16,
        color: '#333',
        flexDirection: 'row',
        alignItems: 'center'
    },
    locationInputs: {
        flex: 1,
        padding: 12,
        paddingStart: 8,
        marginStart: 8,
        fontSize: 16,
        color: '#333'
    },
    inputIcon: {
        // width: 36,
        // height: 36,
        // backgroundColor: '#F8F9FA',
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    locationButton: {
        padding: 12
    },
    locationIcon: {
        width: 24,
        height: 24
    },
    packageSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        padding: 16,
        backgroundColor: '#fff'
    },
    packageText: {
        fontSize: 16,
        color: '#333'
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
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginTop: 4,
        maxHeight: 200,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    predictionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12
    },
    predictionIcon: {
        width: 16,
        height: 16,
        marginRight: 8
    },
    predictionText: {
        flex: 1,
        fontSize: 14
    },
    separator: {
        height: 1,
        backgroundColor: '#E5E5E5',
        marginHorizontal: 12
    }
})
