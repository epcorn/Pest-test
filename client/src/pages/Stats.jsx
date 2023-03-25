import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Loading } from "../components";
import { getCompanyServices } from "../redux/adminSlice";
import { toggleSidebar } from "../redux/userSlice";

const Stats = () => {
  const { adminLoading, allClients } = useSelector((store) => store.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCompanyServices());
  }, []);

  if (adminLoading) return <Loading />;

  return (
    <div className="add-client">
      <div className="row">
        <h4 className="text-center">{allClients.length > 0 ? "All Clients" : "No Client"}</h4>
        {allClients?.map((item, index) => {
          return (
            <div className="col-md-4" key={item._id}>
              <div
                className={`card text-bg-light text-center ${
                  index % 2 === 0 ? "border-success" : "border-warning"
                }`}
              >
                <div className="card-header">{item.shipToName}</div>
                <div className="card-body py-2">
                  <h6 className="card-subtitle mb-2 text-muted">
                    {item.shipToAddress}
                  </h6>
                  <p className="card-text mb-0">
                    Some quick example text to build on the card title and make
                  </p>
                  <Link
                    to={`/dashboard/client/${item._id}`}
                    className="btn btn-sm btn-primary"
                  >
                    All Sub Locations
                  </Link>
                  <Link
                    to={`/dashboard/client/${item._id}`}
                    className="btn btn-sm ms-2 "
                  >
                    Edit Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Stats;
