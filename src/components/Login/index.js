import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {username: '', password: '', showError: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  OnLogin = async event => {
    const {history} = this.props
    const {username, password} = this.state
    event.preventDefault()

    const url = 'https://apis.ccbp.in/login'
    const userDeatils = {
      username,
      password,
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(userDeatils),
    }

    const response = await fetch(url, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      Cookies.set('jwt_token', data.jwt_token, {expires: 10})
      this.setState({username: '', password: '', showError: false})
      history.replace('/')
    } else {
      const data = await response.json()
      this.setState({showError: true, errorMsg: data.error_msg})
    }
  }

  render() {
    const {showError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="bg-container">
        <form onSubmit={this.OnLogin} className="login-field-container">
          <img
            className="website-logo-img"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />

          <label htmlFor="username" className="input-label">
            USERNAME
          </label>
          <input
            onChange={this.onChangeUsername}
            placeholder="Username"
            className="input"
            id="username"
            type="text"
          />

          <label htmlFor="password" className="input-label">
            PASSWORD
          </label>
          <input
            onChange={this.onChangePassword}
            placeholder="Password"
            className="input"
            id="password"
            type="password"
          />

          <button type="submit" className="login-btn">
            Login
          </button>

          {showError && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
