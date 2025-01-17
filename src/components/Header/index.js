import './index.css'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {IoMdHome} from 'react-icons/io'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    history.replace('/login')
    Cookies.remove('jwt_token')
  }
  return (
    <div className="header-bg-container">
      <Link to="/">
        <img
          alt="website logo"
          className="header-web-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        />
      </Link>

      <ul className="header-link-container">
        <Link className="header-link" to="/">
          <li className="li">Home</li>
        </Link>
        <Link className="header-link" to="/jobs">
          <li className="li">Jobs</li>
        </Link>
        <li className="li">
          <button onClick={onLogout}>Logout</button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
