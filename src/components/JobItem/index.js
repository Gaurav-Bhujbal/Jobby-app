import './index.css'
import Header from '../Header'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {TiStarFullOutline} from 'react-icons/ti'
import {IoLocationSharp} from 'react-icons/io5'
import {MdWork} from 'react-icons/md'
import {RiExternalLinkLine} from 'react-icons/ri'
import JobCard from '../JobCard'
import Loader from 'react-loader-spinner'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class JobItem extends Component {
  state = {jobData: [], apiStatus: apiStatusConstant.initial}

  getJobItemData = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {id} = this.props.match.params
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      this.setState({jobData: data, apiStatus: apiStatusConstant.success})
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  componentDidMount() {
    this.getJobItemData()
  }

  renderData = () => {
    const {apiStatus, jobData} = this.state
    const {job_details} = jobData
    const {similar_jobs} = jobData
    switch (apiStatus) {
      case apiStatusConstant.success:
        return (
          <>
            <li className="job-card">
              <div className="job-card-header">
                <img
                  className="job-card-logo"
                  alt="job details company logo"
                  src={job_details.company_logo_url}
                />
                <div>
                  <h2>{job_details.title}</h2>
                  <p>
                    <TiStarFullOutline className="star" />
                    {job_details.rating}
                  </p>
                </div>
              </div>
              <div className="JobCard-package-container">
                <div className="job-card-location-container">
                  <p className="JobCard-location">
                    <IoLocationSharp />
                    {job_details.location}
                  </p>
                  <p>
                    <MdWork />
                    {job_details.employment_type}
                  </p>
                </div>
                <p>{job_details.package_per_annum}</p>
              </div>
              <hr className="line" />
              <div className="job-item-visit-container">
                <h2 className="JobCard-Description">Description</h2>
                <a href={job_details.company_website_url}>
                  Visit
                  <RiExternalLinkLine />
                </a>
              </div>
              <p>{job_details.job_description}</p>
            </li>
            <h3 className="skill">Skills</h3>
            <ul className="skill-container">{this.renderSkills()}</ul>
            <div>
              <h1>Life at Company</h1>
              <p>{jobData.job_details.life_at_company.description}</p>
              <img
                alt="life at company"
                className="life-img"
                src={jobData.job_details.life_at_company.image_url}
              />
            </div>
            <div className="Similar-job-container">
              <h1>Similar Jobs</h1>
              <ul>
                {similar_jobs.map(each => {
                  return (
                    <li key={each.id} className="job-card">
                      <div className="job-card-header">
                        <img
                          className="job-card-logo"
                          alt="similar job company logo"
                          src={each.company_logo_url}
                        />
                        <div>
                          <h2>{each.title}</h2>
                          <p>
                            <TiStarFullOutline className="star" />
                            {each.rating}
                          </p>
                        </div>
                      </div>
                      <div className="JobCard-package-container">
                        <div className="job-card-location-container">
                          <p className="JobCard-location">
                            <IoLocationSharp />
                            {each.location}
                          </p>
                          <p>
                            <MdWork />
                            {each.employment_type}
                          </p>
                        </div>
                        <p>{each.package_per_annum}</p>
                      </div>
                      <hr className="line" />
                      <h2 className="JobCard-Description">Description</h2>
                      <p>{each.job_description}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
          </>
        )
        break
      case apiStatusConstant.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
        break
      case apiStatusConstant.failure:
        return (
          <div>
            <img
              alt="failure view"
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for.</p>
            <button onClick={this.getJobItemData} className="JobCard-Retry">
              Retry
            </button>
          </div>
        )
    }
  }

  renderSkills = () => {
    const {skills} = this.state.jobData.job_details
    return skills.map(each => {
      return (
        <li className="job-item-skill" key={each.name}>
          <img alt={each.name} className="skill-img" src={each.image_url} />
          <h3>{each.name}</h3>
        </li>
      )
    })
  }

  render() {
    return (
      <div className="job-item-bg-container">
        <Header />
        <div className="JobItem-container">{this.renderData()}</div>
      </div>
    )
  }
}

export default JobItem
