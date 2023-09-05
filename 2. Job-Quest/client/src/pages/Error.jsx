import { Link, useRouteError } from "react-router-dom";
import Wrapper from "../assets/wrappers/ErrorPage";
import img from "../assets/images/not-found.svg";

const Error = () => {
  const err = useRouteError();
  console.log("err: ", err);

  let errorContent = (
    <Wrapper>
      <div>
        <img src={img} alt="route not found"></img>
        <h3>Ohh! Page not found</h3>
        <p>we are not able to find page you are looking for</p>
        <Link to="/dashboard">back home</Link>
      </div>
    </Wrapper>
  );
  // if(err.status !== 404){

  // }
  return errorContent;
};

export default Error;
