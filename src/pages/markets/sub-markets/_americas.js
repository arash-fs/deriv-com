import React from 'react'
import styled from 'styled-components'
import { Text } from 'components/elements'
import { localize } from 'components/localization'
import { Flex } from 'components/containers'
import { OTCUS, OTCUSTECH, OTCWALLSTREET } from 'components/elements/symbols.js'

const Symbol = styled(Flex)`
    width: fit-content;
    margin-right: 2.4rem;

    svg {
        width: 32px;
        height: 32px;
        margin-right: 0.8rem;
    }
    ${Text} {
        font-weight: normal;
    }
`

const Americas = () => {
    return (
        <>
            <Symbol ai="center">
                <OTCUS />
                <Text>{localize('US Index')}</Text>
            </Symbol>
            <Symbol ai="center">
                <OTCUSTECH />
                <Text>{localize('US Tech Index')}</Text>
            </Symbol>
            <Symbol ai="center">
                <OTCWALLSTREET />
                <Text>{localize('Wall Street Index')}</Text>
            </Symbol>
        </>
    )
}

export default Americas
