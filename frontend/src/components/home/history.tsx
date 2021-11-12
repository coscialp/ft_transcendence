import React from 'react'

function History()
{ //md:w-80 h-44 md:h-52
    return (
        <div className="top-10% ml-5% w-23% h-60% absolute font-sans text-white text-left sm:text-sm md:text-3xl float-left pb-80 overflow-hidden">
            Last game
            <div className="h-100% w-full grid grid-rows-2 grid-flow-col bg-Banner rounded-2xl">
                <div className="font-sans overflow-hidden flex items-center justify-center text-sm sm:text-sm md:text-4xl lg:text-6xl text-LiGreen border-b-2 border-r-2">Win</div>
                <div className="font-sans overflow-hidden flex items-center justify-center text-sm sm:text-sm md:text-4xl lg:text-6xl text-gold border-r-2"> Rank 3</div>
                <div className="font-sans overflow-hidden flex items-center justify-center text-sm sm:text-sm md:text-4xl lg:text-6xl text-white border-b-2">11 : 6</div>
                <div className="font-sans overflow-hidden flex items-center justify-center text-sm sm:text-sm md:text-4xl lg:text-6xl text-white">1256</div>
            </div>
        </div>
    )
}

export default History