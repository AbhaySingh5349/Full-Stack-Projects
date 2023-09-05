import { Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo } from "../components";

const Login = () => {
  return (
    <Wrapper>
      <form className="form">
        <Logo />
        <h4>LogIn</h4>
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
        <button type="submit" className="btn btn-block">
          Submit
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
      </form>
    </Wrapper>
  );
};

export default Login;
