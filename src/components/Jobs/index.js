import './index.css'
import Header from '../Header'
import {IoMdSearch} from 'react-icons/io'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import JobCard from '../JobCard'
const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

const JobDataApiStatusConstant = {
  JobDataInitial: 'INITIAL',
  JobDataSuccess: 'SUCCESS',
  JobDataInProgress: 'IN_PROGRESS',
  JobDataFailure: 'FAILURE',
}

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

class Jobs extends Component {
  state = {
    profileDetails: {},
    minimumPackage: '',
    searchQuery: '',
    allJobData: [],
    employmentQuery: '',
    apiStatus: apiStatusConstant.initial,
    allJobApiStatus: JobDataApiStatusConstant.JobDataInitial,
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok) {
      const userDetails = await response.json()
      this.setState({
        profileDetails: userDetails,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  getAllJobData = async () => {
    let {employmentQuery, minimumPackage, searchQuery} = this.state
    employmentQuery = employmentQuery.split(',')
    employmentQuery = employmentQuery.filter(each => {
      return each !== ''
    })
    employmentQuery = employmentQuery.join(',')
    console.log(employmentQuery)
    this.setState({allJobApiStatus: JobDataApiStatusConstant.JobDataInProgress})
    const jwtToken = Cookies.get('jwt_token')

    let url = `https://apis.ccbp.in/jobs?employment_type=${employmentQuery}&minimum_package=${minimumPackage}&search=${searchQuery}`

    console.log(url)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const allJobData = await response.json()
      this.setState({
        allJobData: allJobData.jobs,
        allJobApiStatus: JobDataApiStatusConstant.JobDataSuccess,
      })
    } else {
      this.setState({allJobApiStatus: JobDataApiStatusConstant.JobDataFailure})
    }
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getAllJobData()
  }

  renderUserProfile = () => {
    const {profileDetails} = this.state
    const {profile_details} = profileDetails

    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return (
          <div className="profile-card">
            <img alt="profile" src={profile_details.profile_image_url} />
            <h1>{profile_details.name}</h1>
            <p>{profile_details.short_bio}</p>
          </div>
        )
        break
      case apiStatusConstant.failure:
        return (
          <div className="profile-failur-view">
            <button
              onClick={this.getProfileDetails}
              className="Retry-btn"
            >
              Retry
            </button>
          </div>
        )
        break
      case apiStatusConstant.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
    }
  }

  onSelectEmployment = event => {
    let {employmentQuery} = this.state
    if (event.target.checked) {
      if (employmentQuery === '') {
        this.setState(
          prevState => ({
            employmentQuery: prevState.employmentQuery + event.target.value,
          }),
          this.getAllJobData,
        )
      } else {
        this.setState(
          prevState => ({
            employmentQuery:
              prevState.employmentQuery + ',' + event.target.value,
          }),
          this.getAllJobData,
        )
      }
    } else {
      employmentQuery = employmentQuery.replace(event.target.value, '')
      this.setState({employmentQuery: employmentQuery}, this.getAllJobData)
    }
  }

  renderEmploymentTypes = () => {
    return (
      <ul className="employment-list-container">
        {employmentTypesList.map(each => {
          return (
            <li key={each.employmentTypeId}>
              <input
                value={each.employmentTypeId}
                onClick={this.onSelectEmployment}
                id={each.employmentTypeId}
                type="checkbox"
              />
              <label htmlFor={each.employmentTypeId}>{each.label}</label>
            </li>
          )
        })}
      </ul>
    )
  }

  onSelectSalaryRange = event => {
    this.setState({minimumPackage: event.target.value}, this.getAllJobData)
  }

  renderSalaryRange = () => {
    return (
      <ul className="salaryRange-list-container">
        {salaryRangesList.map(each => {
          return (
            <li key={each.salaryRangeId}>
              <input
                value={each.salaryRangeId}
                onClick={this.onSelectSalaryRange}
                name="salary"
                id={each.salaryRangeId}
                type="radio"
              />
              <label htmlFor={each.salaryRangeId}>{each.label}</label>
            </li>
          )
        })}
      </ul>
    )
  }

  renderJobData = () => {
    const {allJobData, allJobApiStatus} = this.state
    switch (allJobApiStatus) {
      case JobDataApiStatusConstant.JobDataSuccess:
        if (allJobData.length === 0) {
          return (
            <di className="no-job-container">
              <img
                className="no-jobs-img"
                alt="no jobs"
                src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              />
              <h1>No Jobs Found</h1>
              <p>We could not find any jobs. Try other filters.</p>
            </di>
          )
        }
        return (
          <ul className="job-data-list-container">
            {allJobData.map(each => {
              return <JobCard key={each.id} jobCardDetails={each} />
            })}
          </ul>
        )
        break
      case JobDataApiStatusConstant.JobDataInProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
        break
      case JobDataApiStatusConstant.JobDataFailure:
        return (
          <div>
            <img
              alt="failure view"
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for.</p>
            <button onClick={this.getAllJobData} className="JobCard-Retry">
              Retry
            </button>
          </div>
        )
    }
  }

  onSearch = event => {
    this.setState({searchQuery: event.target.value})
  }

  onClickSearch = () => {
    this.getAllJobData()
  }

  render() {
    return (
      <div className="jobs-bg-container">
        <Header />
        <div className="jobs-search-container">
          <input
            onChange={this.onSearch}
            placeholder="Search"
            className="job-search"
            type="search"
          />
          <button
            onClick={this.onClickSearch}
            className="search-icon"
            type="button"
            data-testid="searchButton"
          >
            <BsSearch />
          </button>
        </div>
        {this.renderUserProfile()}
        <div className="job-container">
          <hr className="line" />
          <div className="employment-container">
            <h2>Type of Employment</h2>
            {this.renderEmploymentTypes()}
            <hr className="line" />
            <h2>Salary Range</h2>
            {this.renderSalaryRange()}
            {this.renderJobData()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
