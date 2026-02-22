import React from "react";
import { useParams } from "react-router-dom";
import { useGetScheduleByIdQuery } from "../../../store/api/schedulesApiSlice";

const ScheduleDetails = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetScheduleByIdQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching schedule details</div>;
  }

  return (
    <div>
      <h2>Schedule Details</h2>
      <p>
        <strong>Room ID:</strong> {data.schedule.roomId}
      </p>
      <p>
        <strong>Start Time:</strong>{" "}
        {new Date(data.schedule.startTime).toLocaleString()}
      </p>
      <p>
        <strong>End Time:</strong>{" "}
        {new Date(data.schedule.endTime).toLocaleString()}
      </p>
    </div>
  );
};

export default ScheduleDetails;
