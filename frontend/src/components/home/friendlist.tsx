import React, { ReactElement } from 'react'
import {usernews} from './usernews'
import { Displayfriend } from './props'

function FriendList(): ReactElement
{
    return (
        <div className="top-10% absolute right-5% h-35% w-23% font-sans text-white text-center text-xl sm:text-sm md:text-3xl">
             Friend
            <div className="bg-Banner h-full w-full overflow-y-scroll scrollbar-hide rounded-2xl">
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