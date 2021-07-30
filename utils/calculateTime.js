import moment from "moment";
import Moment from "react-moment";

const calculateTime = createdAt => {

  const isToday = new Date(createdAt) >= new Date(new Date().toDateString());

  if (isToday) {
    return (
      <>
        Today <Moment interval={0} format="hh:mm A">{createdAt}</Moment>
      </>
    );
  } else {
    return <Moment interval={0} format="MMM DD, hh:mm A">{createdAt}</Moment>;
  }
};

export default calculateTime;
