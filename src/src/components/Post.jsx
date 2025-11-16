import PropTypes from "prop-types"
import { User } from "./User.jsx"

export function Post({title, contents, author, expiresAt, bid}){
    //I got this code from ChatGPT, but I can explain how it works
    //it takes the createdAt data that we created previously and converts it into time that is easy to read by humans
    //using 'short' for dateStyle makes it display the day like mm/dd/yyyy  instead of month dd yyyy
    //using 'short' for timeStyle makes it display the time of day hr:min instead of hr:min:sec
    function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
    }
    return (
        <article>
            <h3>{title}</h3>
            <div>{contents}</div>
            <div><p>Current bid: {bid}</p></div>
            <em>
                <br />
                Posted by <User id={author} />
                <p>Bidding ends at: {formatDate(expiresAt)}</p>
            </em>
        </article>
    )
}

Post.propTypes = {
    title: PropTypes.string.isRequired,
    contents: PropTypes.string,
    author: PropTypes.string,
    expiresAt: PropTypes.string,
    bid: PropTypes.number
}