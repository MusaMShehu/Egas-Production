import { Outlet } from "react-router-dom";
import LearnMore from "../../pages/Learn More/learnMore";

const OpportunitiesLayout = () => {
  return (
    <div>
      {/* <LearnMore /> */}
      <Outlet />
    </div>
  );
};

export default OpportunitiesLayout;
