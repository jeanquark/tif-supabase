import { createContext, useContext } from 'react'

const TestContext = createContext()

export function TestWrapper({ children }) {
    let sharedState = {
        name: 'Jean-Marc',
    }
    console.log('[test-context] state: ', sharedState)
    return <TestContext.Provider value={sharedState}>{children}</TestContext.Provider>
}

export function useTestContext() {
    return useContext(TestContext)
}
