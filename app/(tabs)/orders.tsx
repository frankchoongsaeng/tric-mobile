import ParallaxScrollView from '@/components/ParallaxScrollView'
import { IconSymbol } from '@/components/ui/IconSymbol'
import React from 'react'

export default function Orders() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<IconSymbol size={310} color='#808080' name='add-comment' />}
        ></ParallaxScrollView>
    )
}
