import React from 'react'
import { UsersIcon } from '@heroicons/react/outline'

function NavBarFriend() {
  return (
    <button
      type="button"
      className="bg-gray-900 p-1.5 rounded-full text-white hover:text-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gold focus:text-gold">
      <span className="sr-only">View notifications</span>
      <UsersIcon className="h-6 w-6" aria-hidden="true" />
    </button>
  )
}

export default NavBarFriend