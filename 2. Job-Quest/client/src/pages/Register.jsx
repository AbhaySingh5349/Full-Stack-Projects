import { Form, redirect, useNavigation, Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo } from "../components";

import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/auth/register", data);
    console.log("Registered user successfully: ", data);
    toast.success("Registered user successfully");
    return redirect("/login");
  } catch (error) {
    console.log("register.jsx error: ", error);
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Register = () => {
  const navigation = useNavigation();
  // console.log("navigation: ", navigation);

  const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        <FormRow
          name="name"
          labelText="Name"
          type="text"
          defaultValue="Abhay"
        ></FormRow>
        <FormRow
          name="email"
          labelText="Email"
          type="email"
          defaultValue="a@gmail.com"
        ></FormRow>
        <FormRow
          name="password"
          labelText="Password"
          type="password"
          defaultValue="abc"
        ></FormRow>
        <FormRow
          name="location"
          labelText="Location"
          type="text"
          defaultValue="India"
        ></FormRow>
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? "submitting..." : "submit"}
        </button>
        <p>
          Already a member ?
          <Link to="/login" className="member-btn">
            LogIn
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Register;
