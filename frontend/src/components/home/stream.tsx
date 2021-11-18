import React from 'react'
import YouTube from 'react-youtube'

function Stream() {
  const opts: any = {
    height: '600',
    width: '600',
    playerVars: {
      autoplay: 0,
    },
  };
  return (
    <div className="top-50% absolute ml-5% w-23% h-35% font-sans text-white text-left text-xl sm:text-sm md:text-3xl">
      Stream
      <YouTube className="absolute w-full h-100% rounded-2xl" videoId="H2x7NW4Qjds" opts={opts} />
    </div>
  )
}

export default Stream