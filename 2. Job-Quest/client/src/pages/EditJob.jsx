import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useLoaderData, useNavigation } from "react-router-dom";
import { JOB_STATUS, JOB_TYPE } from "../../../utils/constants";
import { Form, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

import { FormRow, FormRowSelect } from "../components";

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/jobs/${params.id}`);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log("edit job data: ", data);
  try {
    await customFetch.patch(`/jobs/${params.id}`, data);
    toast.success("Job added successfully");
    return redirect("/dashboard/all-jobs");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const EditJob = () => {
  const { job } = useLoaderData();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">edit job</h4>
        <div className="form-center">
          <FormRow type="text" name="role" defaultValue={job.role} />
          <FormRow type="text" name="company" defaultValue={job.company} />
          <FormRow
            type="text"
            name="jobLocation"
            labelText="job location"
            defaultValue={job.jobLocation}
          />
          <FormRowSelect
            name="jobStatus"
            labelText="job status"
            defaultValue={job.jobStatus}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            name="jobType"
            labelText="job type"
            defaultValue={job.jobType}
            list={Object.values(JOB_TYPE)}
          />
          <button
            type="submit"
            className="btn btn-block"
            disabled={isSubmitting}
          >
            {" "}
            {isSubmitting ? "submitting..." : "submit"}{" "}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default EditJob;
