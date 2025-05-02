import { StyleSheet, View, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import { TextInput } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import debounce from 'lodash/debounce'

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
        <SafeAreaView>
            <ScrollView>
                <ThemedView style={styles.container}>
                    <Image source={require('@/assets/images/tric-logo.png')} style={styles.logo} resizeMode='contain' />
                    <ThemedText style={styles.title}>Calculate Your{'\n'}Delivery price</ThemedText>
                    <View style={styles.formSection}>
                        <ThemedText style={styles.label}>Pickup location</ThemedText>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder='Enter pick up location'
                                placeholderTextColor='#999'
                                value={pickupLocation}
                                onChangeText={text => {
                                    setPickupLocation(text)
                                    setShowPredictions(true)
                                }}
                                onFocus={() => setShowPredictions(true)}
                            />
                            <TouchableOpacity
                                style={styles.locationButton}
                                onPress={() => setShowPredictions(!showPredictions)}
                            >
                                <Image source={require('@/assets/images/map-icon.png')} style={styles.locationIcon} />
                            </TouchableOpacity>
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
                                            <ThemedText style={styles.predictionText}>{item.description}</ThemedText>
                                        </TouchableOpacity>
                                    )}
                                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                                    nestedScrollEnabled
                                />
                            </View>
                        )}

                        <ThemedText style={styles.label}>Drop off location</ThemedText>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder='Enter delivery location'
                                placeholderTextColor='#999'
                            />
                            <TouchableOpacity style={styles.locationButton}>
                                <Image source={require('@/assets/images/map-icon.png')} style={styles.locationIcon} />
                            </TouchableOpacity>
                        </View>
                        <ThemedText style={styles.label}>Package</ThemedText>
                        <TouchableOpacity style={styles.packageSelector}>
                            <ThemedText style={styles.packageText}>{packageSize}</ThemedText>
                            <Image
                                source={require('@/assets/images/chevron-down-icon.png')}
                                style={styles.chevronIcon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.checkButton} onPress={() => setIsLoading(true)}>
                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <Image
                                        source={require('@/assets/images/loading-icon.png')}
                                        style={styles.loadingIcon}
                                    />
                                    <ThemedText style={styles.buttonText}>Check</ThemedText>
                                </View>
                            ) : (
                                <ThemedText style={styles.buttonText}>Check</ThemedText>
                            )}
                        </TouchableOpacity>
                        <View style={styles.priceContainer}>
                            <ThemedText style={styles.priceLabel}>Price</ThemedText>
                            <ThemedText type='title' style={styles.priceValue}>
                                {price}
                            </ThemedText>
                        </View>
                    </View>
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    logo: {
        width: 80,
        height: 40,
        marginBottom: 20
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
        color: '#333',
        marginBottom: 30,
        lineHeight: 40
    },
    formSection: {
        gap: 16
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        backgroundColor: '#fff'
    },
    input: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: '#333'
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
