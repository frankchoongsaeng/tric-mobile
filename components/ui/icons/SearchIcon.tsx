import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

const SvgComponent = (props: SvgProps) => (
    <Svg width={13} height={13} fill='none' {...props}>
        <Path
            fill='currentColor'
            d='m12.806 11.871-2.403-2.403c1.839-2.29 1.662-5.678-.435-7.758A5.807 5.807 0 0 0 5.838 0 5.835 5.835 0 0 0 1.71 1.71 5.807 5.807 0 0 0 0 5.839c0 1.564.613 3.016 1.71 4.129a5.807 5.807 0 0 0 4.129 1.71 5.861 5.861 0 0 0 3.645-1.275l2.403 2.403c.13.13.29.194.452.194a.586.586 0 0 0 .451-.194.678.678 0 0 0 .017-.935Zm-2.419-6.048a4.514 4.514 0 0 1-4.532 4.532 4.514 4.514 0 0 1-4.532-4.532A4.514 4.514 0 0 1 5.855 1.29a4.514 4.514 0 0 1 4.532 4.533Z'
        />
    </Svg>
)
export default SvgComponent
