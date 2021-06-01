import { createContext, useState, useEffect } from 'react'
import { supabase } from '../lib/initSupabase'

const ActionsContext = createContext({
    actions: []
});

export function ActionsContextProvider(props) {
    const [actions, setActions] = useState([]);

    useEffect(async () => {
        console.log('[actionsContext] useEffect ActionsContextProvider')
        if (actions.length < 1) {

            setActionsHandler()
        }
    }, [])

    async function setActionsHandler() {
        console.log('[actionsContext] setActionsHandler')

        const { data, error } = await supabase.from('actions').select('*').order('id', true)
            console.log('data: ', data)
            if (error) console.log('error: ', error)
            else setActions(data)
    }

    const context = {
        actions,
        setActions: setActionsHandler
    };

    return (
        <ActionsContext.Provider value={context}>
            {props.children}
        </ActionsContext.Provider>
    );
}

export default ActionsContext;