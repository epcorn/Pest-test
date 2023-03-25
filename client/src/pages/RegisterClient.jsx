import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { InputRow } from "../components";
import { clientRegister, handleAdmin } from "../redux/adminSlice";

const RegisterClient = () => {
  const {
    shipToName,
    shipToAddress,
    shipToEmail,
    shipToNumber,
    adminLoading,
    clientId,
  } = useSelector((store) => store.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (clientId) {
      setTimeout(() => {
        navigate(`/dashboard/client/${clientId}`);
      }, 1000);
    }

    // eslint-disable-next-line
  }, [clientId]);
  const handleClientInput = (e) => {
    let name = e.target.name,
      value = e.target.value;
    dispatch(handleAdmin({ name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(
      clientRegister({ shipToName, shipToAddress, shipToEmail, shipToNumber })
    );
  };

  return (
    <div className="add-client">
      <form className="form">
        <h3 className="text-center">Client Registration</h3>
        <div className="form-center">
          <InputRow
            type="text"
            labelText="Client Name"
            name="shipToName"
            value={shipToName}
            handleChange={handleClientInput}
          />
          <InputRow
            type="email"
            labelText="Client Email"
            name="shipToEmail"
            value={shipToEmail}
            handleChange={handleClientInput}
          />
          <InputRow
            type="text"
            labelText="Client Contact Number"
            name="shipToNumber"
            value={shipToNumber}
            handleChange={handleClientInput}
          />
          <div>
            <label htmlFor="cd">Client Address:</label>
            <textarea
              className="form-textarea"
              name="shipToAddress"
              value={shipToAddress}
              onChange={handleClientInput}
              rows="4"
              cols="40"
            />
          </div>
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={adminLoading}
            >
              Add Client
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default RegisterClient;
