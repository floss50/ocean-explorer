import React from 'react'

const OceanContext = React.createContext({
    did: {
        active: null,
        amount: null
    },
    agreement: {
        active: null,
        amount: null
    },
    condition: {
        active: null,
        amount: null
    },
    addressBook: {}
})

export default OceanContext
