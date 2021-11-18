import React, { ReactElement } from 'react'
import userimg from './img/userimg.jpeg'

export function User(): ReactElement {
	return (
			<div className="absolute w-30% h-85% bg-Banner top-10% left-10% overflow-hidden rounded-2xl">
				<div className="absolute text-4xl h-5% w-100%  text-center top-5% italic overflow-hidden">
					Brittany the tower
				</div>
				<div className="absolute text-2xl h-5% w-100% text-center top-10% overflow-hidden">
					@Brittanytower
				</div>
				<img src={userimg} alt="error" className="absolute h-50% w-80% left-10% top-20% rounded-md"></img>
				<p className="absolute h-20% w-100% text-center text-4xl top-75% text-gold">Rank : 25</p>
				<button className="absolute top-93% left-10% w-30% text-2xl bg-yellow-500 rounded-3xl overflow-hidden hover:bg-yellow-900 hover:text-gold">Add Friend</button>
				<button className="absolute top-93% right-10% w-30% text-2xl bg-red-600 rounded-3xl overflow-hidden hover:bg-red-900 hover:text-gold">Delete Friend</button>
			</div>
	)
}