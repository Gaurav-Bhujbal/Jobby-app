import './index.css'
import {TiStarFullOutline} from 'react-icons/ti'
import {IoLocationSharp} from 'react-icons/io5'
import {MdWork} from 'react-icons/md'
import {Link} from 'react-router-dom'

const JobCard = props => {
  const {jobCardDetails} = props
  console.log(jobCardDetails)

  return (
    <Link to={`/jobs/${jobCardDetails.id}`} className="job-card-link">
      <li className="job-card">
        <div className="job-card-header">
          <img
            className="job-card-logo"
            alt="company logo"
            src={jobCardDetails.company_logo_url}
          />
          <div>
            <h2>{jobCardDetails.title}</h2>
            <p>
              <TiStarFullOutline className="star" />
              {jobCardDetails.rating}
            </p>
          </div>
        </div>
        <div className="JobCard-package-container">
          <div className="job-card-location-container">
            <p className="JobCard-location">
              <IoLocationSharp />
              {jobCardDetails.location}
            </p>
            <p>
              <MdWork />
              {jobCardDetails.employment_type}
            </p>
          </div>
          <p>{jobCardDetails.package_per_annum}</p>
        </div>
        <hr className="line" />
        <h2 className="JobCard-Description">Description</h2>
        <p>{jobCardDetails.job_description}</p>
      </li>
    </Link>
  )
}

export default JobCard
