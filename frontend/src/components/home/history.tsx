import React from 'react'

function History()
{ //md:w-80 h-44 md:h-52
    return (
        <div className="top-10% ml-5% w-20% h-60 absolute font-sans text-white text-center text-3xl md:text-4xl float-left pb-80">
            Last game
            <div className="h-52 w-full mt-1 grid grid-rows-2 grid-flow-col  bg-Banner">
                <div className="font-sans flex items-center justify-center text-2xl md:text-3xl text-LiGreen border-b-2 border-r-2">Win</div>
                <div className="font-sans flex items-center justify-center text-2xl md:text-3xl text-gold border-r-2"> Rank 3</div>
                <div className="font-sans flex items-center justify-center text-2xl md:text-3xl text-white border-b-2">11 : 6</div>
                <div className="font-sans flex items-center justify-center text-2xl md:text-3xl text-white">1256</div>
            </div>
        </div>
    )
}

export default History