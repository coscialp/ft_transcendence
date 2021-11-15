import { GetNews } from './props'
import { usernews } from './usernews'
function Actuality() {
    return (
        <div className="w-25% h-80% top-13% left-37.5% absolute font-sans text-white text-center text-3xl md:text-4xl float-left  overflow-hidden rounded-2xl">
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
    )
}

export default Actuality