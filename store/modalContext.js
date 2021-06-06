import { createContext, useState, useEffect } from 'react'

const ModalContext = createContext({});

export function ModalContextProvider(props) {
    const [modal, setModal] = useState({
        open: false,
        type: '',
        redirectTo: ''
    })

    async function setModalHandler() {
        console.log('[modalContext] setModalHandler')
    }

    const context = {
        modal,
        setModal
    };

    return (
        <ModalContext.Provider value={context}>
            {props.children}
        </ModalContext.Provider>
    );
}

export default ModalContext;