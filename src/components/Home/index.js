import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const Home = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  const onClickFindJobs = () => {
    const {history} = props
    history.push('/jobs')
  }

  return (
    <div className="home-bg-container">
      <Header />
      <div className="home-container">
        <div className="home-description-container">
          <h1>Find The Job That Fits Your Life</h1>
          <p>
            Millions of people are searching for jobs, salary information,
            compony reviews, Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <button onClick={onClickFindJobs}>Find Jobs</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
