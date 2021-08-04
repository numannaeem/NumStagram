import Moment from 'react-moment'

const calculateTime = (createdAt) => {
  const isToday = new Date(createdAt) >= new Date(new Date().toDateString())
  if (isToday) {
    return (
      <>
        Today,{' '}
        <Moment interval={0} format="hh:mm A">
          {createdAt}
        </Moment>
      </>
    )
  } else {
    return (
      <Moment interval={0} format="MMM DD, hh:mm A">
        {createdAt}
      </Moment>
    )
  }
}

export const calculateDays = (date) => {
  let days = (Date.now() - new Date(date)) / (1000 * 60 * 60 * 24)
  days = Math.round(days)
  if (days === 0) {
    return 'today'
  } else if (days === 1) {
    return 'yesterday'
  } else return `${days} days ago`
}

export default calculateTime
