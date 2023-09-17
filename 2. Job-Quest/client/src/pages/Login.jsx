import { Link, redirect, useNavigation, Form } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo } from "../components";

import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log("formData: ", data);

  try {
    await customFetch.post("/auth/login", data);
    console.log("logged-in user successfully: ", data);
    toast.success("logined user successfully");
    return redirect("/dashboard");
  } catch (error) {
    console.log("login.jsx error: ", error);
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Login = () => {
  const navigation = useNavigation();
  // console.log("navigation: ", navigation);

  const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>LogIn</h4>
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
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? "submitting..." : "submit"}
        </button>
        <button type="button" className="btn btn-block">
          Explore The App
        </button>
        <p>
          Not a member yet ?
          <Link to="/register" className="member-btn">
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Login;
