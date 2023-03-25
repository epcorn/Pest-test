import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { InputRow, InputSelect, Loading } from "../components";
import { getLocation } from "../redux/adminSlice";
import { addLocationRecord } from "../redux/reportSlice";

const QRLocation = () => {
  const dispatch = useDispatch();
  const { adminLoading, singleLocation } = useSelector((store) => store.admin);
  const { reportLoading } = useSelector((store) => store.report);
  const [inputField, setInputField] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    dispatch(getLocation(id));

    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (singleLocation) {
      singleLocation.services?.map((item) =>
        inputField.push({
          id: item._id,
          serviceName: item.serviceName,
          action: "",
          value: "",
          comment: "",
          image: null,
        })
      );
    }
  }, [singleLocation]);

  const handleChange = (index, e) => {
    const { name, value, files } = e.target;

    let data = [...inputField];

    if (name === "image") {
      data[index][name] = files[0];
    } else data[index][name] = value;

    setInputField(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputField.filter((item) => item.action).length < 1) {
      return toast.error("Please select valid service action");
    }

    const form = new FormData();

    form.append("id", " ");
    form.append("serviceName", " ");
    form.append("action", " ");
    form.append("value", " ");
    form.append("comment", " ");
    form.append("uploaded", " ");
    form.append("image", " ");

    inputField.forEach((item) => {
      return (
        form.append("id", item.id),
        form.append("serviceName", item.serviceName),
        form.append("action", item.action || false),
        form.append("value", item.value || " "),
        form.append("comment", item.comment || " "),
        form.append("uploaded", item.image ? true : false),
        form.append("image", item.image)
      );
    });

    // for (let item of singleLocation.services) {
    //   if (!state[item.serviceName] || state[item.serviceName] === "Select")
    //     return toast.error("Please select valid service action");
    //   reportData.push({
    //     id: item._id,
    //     serviceName: item.serviceName,
    //     action: state[item.serviceName],
    //   });
    // }

    dispatch(addLocationRecord({ id, form }));
  };

  if (adminLoading) return <Loading />;

  return (
    <div className="location">
      {singleLocation.floor ? (
        <div>
          <div className="details">
            <h5>Floor - {singleLocation.floor}</h5>
            <h5>Location - {singleLocation.location}</h5>
          </div>
          <hr />
          <form className="location-form" onSubmit={handleSubmit}>
            {singleLocation.services?.map((item, index) => {
              return (
                <div key={item._id} className="row">
                  <div className="col-8">
                    <InputSelect
                      labelText={item.serviceName}
                      name="action"
                      qr={true}
                      id={item._id}
                      value={inputField.action}
                      handleChange={(e) => handleChange(index, e)}
                      list={["Select", ...item.serviceOption]}
                    />
                  </div>
                  <div className="col-4">
                    <InputRow
                      type="text"
                      labelText="Value"
                      name="value"
                      qr={true}
                      value={item.value}
                      handleChange={(e) => handleChange(index, e)}
                    />
                  </div>
                  <div className="col-8">
                    <InputRow
                      type="text"
                      labelText="Comment"
                      name="comment"
                      qr={true}
                      value={item.value}
                      handleChange={(e) => handleChange(index, e)}
                    />
                  </div>
                  <div className="col-4 mt-2 qr">
                    <label>
                      <input
                        type="file"
                        className="upload"
                        accept="image/*"
                        name="image"
                        onChange={(e) => handleChange(index, e)}
                      />
                      <span className="btn btn-sm">Image Upload</span>
                    </label>
                  </div>
                  <hr className="hr" />
                </div>
              );
            })}
            <button
              type="submit"
              className="btn btn-success my-3"
              disabled={reportLoading}
            >
              {reportLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      ) : (
        <h4 className="text-center">
          No Location Found. <br /> Contact Admin
        </h4>
      )}
    </div>
  );
};
export default QRLocation;
