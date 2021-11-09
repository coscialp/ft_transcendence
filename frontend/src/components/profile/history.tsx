import React, { ReactElement } from 'react'
import { historix } from './historyres'
import { Displayhistory } from './props'

// function DisplayNoHistory()
// {
//     return (
//         <div className="text-3xl text-center justify center">
//             No match History
//         </div>
//     )
// }

export function Historymatch(): ReactElement
{
    return (
        <div className="absolute h-85% w-40% left-50% bg-white top-10% overflow-y-scroll scrollbar-hide">
            {historix.map(({user1, user2, result, gameid}:{user1: string, user2: string, result:number, gameid:number}) => (
					<Displayhistory
						user1={user1}
                        user2={user2}
                        result={result}
                        gameid={gameid}
					/>
				))}
        </div> 
    )
}