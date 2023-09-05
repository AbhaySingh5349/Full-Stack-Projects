import Wrapper from "../assets/wrappers/LandingPage";

import main from "../assets/images/main.svg";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            vitae feugiat urna. Etiam sed semper tellus, in mattis sapien.
            Suspendisse potenti. Curabitur luctus quis mauris quis tincidunt.
            Mauris molestie, mi at feugiat malesuada, sapien ipsum auctor nisi,
            a dignissim orci quam non metus. Curabitur arcu enim, sodales et
            diam et, ullamcorper sodales felis. Nunc tellus ex, blandit vel
            libero et, malesuada congue nisl
          </p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn">
            LogIn / Demo User
          </Link>
        </div>
        <img src={main} alt="job-hunt" className="img main-img"></img>
      </div>
    </Wrapper>
  );
};

export default Landing;
