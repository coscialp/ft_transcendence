import React from 'react'
import { GetNews } from './get_news'

function Actuality() {
    return (
        <div className="w-actuality h-80% top-10% mx-center absolute font-sans text-white text-center text-3xl md:text-4xl float-left">
            News
            <div className="mt-1 w-full h-full overflow-y-scroll scrollbar-hide">
                <GetNews /*récuperer les données depuis le backend pour afficher la file d'actualité*/ />
            </div>
        </div>
    )
}

export default Actuality