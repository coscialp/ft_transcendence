import React from 'react'
import { Disclosure } from '@headlessui/react'
import { MenuAlt1Icon, XIcon } from '@heroicons/react/outline'
import NavBarProfile from './navbar_profile'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import './button.css'

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const buttons = [
  { name: 'Home', current: true },
  { name: 'Play', current: false },
  { name: 'Shop', current: false },
]

function PageSwitcher(pathname: string) {
  for (let button of buttons) {
    if (`/${button.name}` === pathname || (pathname === "/home" && button.name === 'Home'))
      button.current = true;
    else if (button.current === true && `/${button.name}` !== pathname)
      button.current = false;
  }
}

export function NavBar() {
  let location = useLocation()
  PageSwitcher(location.pathname)
  return (
    <Disclosure as="nav" className="">
      {({ open }) => (
        <>
          <div className="grid-cols-1 mx-auto pr-6">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuAlt1Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:block">
                  <div className="flex">
                    {buttons.map((item) => (
                      <Link
                        to={item.name === 'Home' ? "/home" : "/" + item.name}
                        id={item.name}
                        key={item.name}
                        className={classNames(
                          item.current ? 'bg-MenuColor text-black opacity-60' : 'text-white  transition duration-500 hover:text-MenuColor opacity-30 hover:opacity-60',
                          'px-4 py-4  text-2xl font-medium'
                        )}>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 -mr-4">
                <SearchBar />
                {/* Profile dropdown */}
                <NavBarProfile />
              </div>
            </div>
          </div>
        </>)}
    </Disclosure>)
}