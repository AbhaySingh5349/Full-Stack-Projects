import { toast } from "react-toastify";
import { JobsContainer, SearchContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
// import { BsInfo } from "react-icons/bs";
import { createContext, useContext } from "react";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/jobs");
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllJobsContext = createContext();

const AllJobs = () => {
  const { jobs } = useLoaderData();
  console.log("All Jobs: ", jobs);
  return (
    <AllJobsContext.Provider value={{ jobs }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

// how data set is prepared ?
// i/p to model (how that looks) => multiple bands , how temporal info. is used ?

export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobs;
