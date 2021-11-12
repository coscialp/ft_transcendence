import { GetNews } from './props'
import { usernews } from './usernews'
function Actuality() {
    return (
        <div className="w-40% h-80% top-13% left-30% absolute font-sans text-white text-center text-3xl md:text-4xl float-left bg-Banner overflow-hidden rounded-2xl">
            <div className="mt-1 w-full h-full overflow-y-scroll scrollbar-hide">
                {usernews.map(({user, msg}:any) => (
					<GetNews
						user={user}
                        msg={msg}
					/>
				))}
            </div>
        </div>
    )
}

export default Actuality