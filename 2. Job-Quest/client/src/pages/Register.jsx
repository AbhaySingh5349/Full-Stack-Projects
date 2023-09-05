import { Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo } from "../components";

const Register = () => {
  return (
    <Wrapper>
      <form className="form">
        <Logo />
        <h4>Register</h4>
        <FormRow
          id="name"
          labelText="Name"
          type="text"
          defaultValue="Abhay"
        ></FormRow>
        <FormRow
          id="last-name"
          labelText="Last Name"
          type="text"
          defaultValue="Singh"
        ></FormRow>
        <FormRow
          id="email"
          labelText="Email"
          type="email"
          defaultValue="a@gmail.com"
        ></FormRow>
        <FormRow
          id="password"
          labelText="Password"
          type="password"
          defaultValue="abc"
        ></FormRow>
        <FormRow
          id="location"
          labelText="Location"
          type="text"
          defaultValue="India"
        ></FormRow>
        <button type="submit" className="btn btn-block">
          Submit
        </button>
        <p>
          Already a member ?
          <Link to="/login" className="member-btn">
            LogIn
          </Link>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
