
import { useCallback, useRef } from 'react';

// Custom hook để manage row selection
export const useRowSelection = () =>
{
    const previousSelectionRef = useRef<Record<string, boolean>>( {} );

    const handleRowSelectionChange = (
        newSelection: Record<string, boolean>,
        onSelectionChange: ( selected: string[], deselected: string[] ) => void
    ) =>
    {
        // //console.log( "Row selection changed:", newSelection );
        const oldSelection = previousSelectionRef.current;
        // //console.log( "Old selection:", oldSelection );

        const newlySelected = Object.entries( newSelection )
            .filter( ( [ rowId, isSelected ] ) => isSelected && !oldSelection[ rowId ] )
            .map( ( [ rowId ] ) => rowId );

        const newlyDeselected = Object.entries( oldSelection )
            .filter( ( [ rowId, wasSelected ] ) => wasSelected && !newSelection[ rowId ] )
            .map( ( [ rowId ] ) => rowId );

        previousSelectionRef.current = { ...newSelection };

        if ( newlySelected.length > 0 || newlyDeselected.length > 0 )
        {
            onSelectionChange( newlySelected, newlyDeselected );
        }
    };

    const resetSelection = useCallback( () =>
    {
        previousSelectionRef.current = {};
    }, [] );

    return {
        handleRowSelectionChange,
        resetSelection
    };
};