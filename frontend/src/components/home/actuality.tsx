import { GetNews } from './props'
import { usernews } from './usernews'
function Actuality() {
    return (
        <div>
        <div className="w-25% h-74% top-13% left-37.5% absolute font-sans text-white text-center text-3xl md:text-4xl float-left  overflow-hidden rounded-2xl">
            <div className="mt-1 w-full h-full overflow-y-scroll scrollbar-hide">
                 {usernews.map(({ user, msg, img, connect }: { user: string, msg: string, img: string, connect: number }) => (
                    <GetNews
                        user={user}
                        msg={msg}
                        img={img}
                        connect={connect}
                    />
                ))}
            </div>
        </div>
            <div className="absolute left-37.5% top-88% h-5% w-25% bg-BoxActuality rounded-xl">
            <input type="text" className=" mt-2.5% ml-3% shadow-none rounded-none bg-transparent w-full mr-3% focus:outline-none" placeholder="Send message..."/>
            </div>   
        </div>
    )
}

export default Actuality