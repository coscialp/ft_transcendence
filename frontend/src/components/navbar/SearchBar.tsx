import React from 'react'
import { SearchIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import axios from 'axios'

function send_val(val: string) {
    axios({
        method: 'post',
        url: 'http://localhost:5000/hello',
        data: { firstName: val },
    }).then(
        (response) => console.log(response)
    ).catch((erreur) => console.log(erreur));
}

function SearchBar() {
    const [inputValue, setInputValue] = useState('')

    return (
        <div className="-ml-15% mr-15% relative bg-BoxActuality rounded-3xl">
            <SearchIcon className="ml-2% mt-1% absolute h-5 w-5" onClick={() => send_val(inputValue)} />
            <input type="text" className=" ml-18% bg-transparent w-full mr-3% focus:outline-none" placeholder="Search User..." onChange={(e) => setInputValue(e.target.value)} />
        </div>
    )
}
export default SearchBar