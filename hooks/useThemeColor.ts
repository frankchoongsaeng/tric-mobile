/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { TricColors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

export function useTricThemeColor() {
    const theme = useColorScheme() ?? 'light'
    return TricColors[theme]
}
