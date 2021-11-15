import React, { ReactElement } from 'react'
import {usernews} from './usernews'
import { Displayfriend } from './props'

function FriendList(): ReactElement
{
    return (
        <div className="top-10% absolute left-75% h-25% w-20% font-sans text-white text-center text-3xl md:text-4xl">
             Friend
            <div className="bg-Banner h-full w-full overflow-y-scroll scrollbar-hide">
            {usernews.map(({user, msg}:any) => (
					<Displayfriend
						user={user}
                        msg={msg}
					/>
				))}
            </div>
        </div>
    )
}

export default FriendList