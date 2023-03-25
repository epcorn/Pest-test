import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AddLocation, Loading } from "../components";
import { setEdit, singleClient } from "../redux/adminSlice";
import { saveAs } from "file-saver";

const SingleClient = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { singleClientDetails, singleClientLocations, adminLoading } =
    useSelector((store) => store.admin);

  const [alreadyService, setAlreadyService] = useState(null);

  useEffect(() => {
    dispatch(singleClient(id));

    // eslint-disable-next-line
  }, [open]);

  const downloadImage = (url, name) => {
    saveAs(url, `${name}.jpg`); // Put your image url here.
  };

  const openEdit = (item) => {
    dispatch(
      setEdit({
        isEditing: true,
        floor: item.floor,
        location: item.location,
        locationId: item._id,
      })
    );
    setOpen(true);
    setAlreadyService(item.services);
  };

  return (
    <div className="row">
      <div className="col-12 text-center">
        <h4>Client Name: {singleClientDetails.shipToName}</h4>
      </div>
      <AddLocation clientId={id} alreadyService={alreadyService} />
      {singleClientLocations && (
        <div className="col-12 ">
          <table className="table table-striped table-bordered border-primary">
            <thead>
              <tr>
                <th style={{ width: 150 }} className="text-center">
                  Floor
                </th>
                <th className="text-center">Location</th>
                <th className="text-center">Services</th>
                <th style={{ width: 110 }} className="text-center">
                  QR Code
                </th>
                <th style={{ width: 80 }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {singleClientLocations?.map((item) => (
                <tr key={item._id}>
                  <td>{item.floor}</td>
                  <td>{item.location}</td>
                  <td>
                    {item.services?.map((item) => (
                      <span className="me-1" key={item.serviceName}>
                        {item.serviceName},
                      </span>
                    ))}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => downloadImage(item.qr, item.location)}
                    >
                      Download
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm me-2"
                      onClick={() => openEdit(item)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default SingleClient;
