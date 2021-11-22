import { useHistory } from "react-router";

export function NotFound() {

    let history = useHistory();

    return (
        <div className="notFound">
            <h1 className="neonTextNF">404</h1>
            <h2 className="neonTextNF">Page Not Found</h2> 
            <button className="neonTextNF" onClick={ () => { return history.push("/") } }>Go home !</button>
        </div>
    )
}