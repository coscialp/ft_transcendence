import React, { ReactElement } from 'react'
import userimg from './userimg.jpeg'

export function User(): ReactElement
{
    return (
        <div className="absolute w-30% h-85% bg-Banner top-10% left-10%">
            <div className="absolute text-4xl h-30% w-100% opacity-100 text-center top-5%">
                Brittany the tower
            </div>
            <div className="absolute text-2xl h-30% w-100% opacity-100 text-center top-10%">
                @Brittanytower
            </div>
            <img src={userimg} alt="error" className="absolute h-50% w-80% left-10% top-25% rounded-3xl"></img>
        </div>
    )
}