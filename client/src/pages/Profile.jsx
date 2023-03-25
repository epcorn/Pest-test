import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddUser, Loading } from "../components";
import { getAllUsers } from "../redux/userSlice";

const Profile = () => {
  const { userLoading, allUsers } = useSelector((store) => store.user);
  const [toggle, setToggle] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  if (userLoading) return <Loading />;

  return (
    <div className="profile">
      {toggle ? (
        <AddUser setToggle={setToggle} />
      ) : (
        <div className="row">
          {allUsers[0] && (
            <>
              <h3 className="text-center mt-0">Company Details</h3>
              <div className="col-md-5">
                <h5>Name - {allUsers[0].company.companyName} </h5>
              </div>
              <div className="col-md-7">
                <h5>Address - {allUsers[0].company.companyAddress} </h5>
              </div>
              <div className="col-md-6">
                <h5>Contact - {allUsers[0].company.companyContact} </h5>
              </div>
              <div className="col-md-6">
                <h5>Email Id - {allUsers[0].company.companyEmail} </h5>
              </div>
            </>
          )}

          <div className="add-client">
            <h4 className="text-center">All Users</h4>
            <table className="table table-striped table-bordered border-warning">
              <thead>
                <tr>
                  <th className="text-center">Name</th>
                  <th className="text-center" style={{ width: 120 }}>
                    Role
                  </th>
                  <th className="text-center">Login Id</th>
                  <th style={{ width: 240 }} className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUsers?.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td className="text-center">{item.role}</td>
                    <td>{item.email}</td>
                    <td className="text-center">
                      {item.role === "Admin" ? (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => setToggle(!toggle)}
                        >
                          Register User
                        </button>
                      ) : (
                        <>
                          <button className="btn edit-btn btn-sm me-2">
                            Forgot Password
                          </button>
                          <button className="btn btn-sm btn-danger">
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default Profile;
