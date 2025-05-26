import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getData, putData, deleteData } from "../../libs/api";
import { loadAuthUser } from "../../libs/auth";

import { Navbar } from "../../components/Navbar";


export default function FarmUpdateForm() {

  const farmLabId = useParams().farmId;
  const navigate = useNavigate();
  const authUser = loadAuthUser();

  const [farmName, setFarmName] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [farmLongitude, setFarmLongitude] = useState(0);
  const [farmLatitude, setFarmLatitude] = useState(0);

  useEffect(() => {
    if (farmLabId) {
      getData({
        url: `/farmlabs/${farmLabId}/`,
        callback: (data) => {
          setFarmName(data.name);
          setFarmAddress(data.address);
          setFarmLongitude(data.longitude);
          setFarmLatitude(data.latitude);
        },
      });
    }
  }, [farmLabId]);

  const handleSave = () => {
    const formData = new FormData(document.querySelector("form"));
    const body = {
      owner: authUser.id,
      name: formData.get("name"),
      address: formData.get("address"),
      longitude: formData.get("longitude"),
      latitude: formData.get("latitude"),
    }

    putData(
      {
        url: `/farmlabs/${farmLabId}/`,
        callback: (data) => {
          navigate(`/farms/${farmLabId}/`);
          toast.success("Cập nhật Farm Lab thành công");
        },
        body: body,
      }
    )
  }

  const handleCancel = () => {
    navigate(`/farms/${farmLabId}/`);
  }

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xoá Farm Lab này không?")) {
      deleteData(
        {
          url: `/farmlabs/${farmLabId}/`,
          callback: (data) => {
            navigate(`/farms/${farmLabId}/`);
            toast.success("Xoá Farm Lab thành công");
          },
        }
      )
    }
  }

  return (
    <div className="flex flex-col h-screen">

      <Navbar />

      <form 
        className="flex justify-center items-center flex-grow px-4"
        onSubmit={(e) => {e.preventDefault(); handleSave()}}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg border w-full max-w-3xl mx-auto">

          <h2 className="text-center font-bold text-xl mb-4">Thông tin Farm Lab</h2>

          <label className="block text-sm font-semibold">Tên Farm Lab</label>
          <input
            type="text"
            maxLength={255}
            required
            className="w-full p-2 border rounded-md mb-2"
            name="name"
            value={farmName || ""}
            onChange={(e) => setFarmName(e.target.value)}
          />

          <label className="block text-sm font-semibold">Địa chỉ</label>
          <input
            type="text"
            maxLength={255}
            required
            className="w-full p-2 border rounded-md mb-2"
            name="address"
            value={farmAddress || ""}
            onChange={(e) => setFarmAddress(e.target.value)}
          />

          <label className="block text-sm font-semibold">Kinh độ</label>
          <input
            type="number"
            step="any"
            min={-180}
            max={180}
            required
            className="w-full p-2 border rounded-md mb-2"
            name="longitude"
            value={farmLongitude || ""}
            onChange={(e) => setFarmLongitude(e.target.value)}
          />

          <label className="block text-sm font-semibold">Vĩ độ</label>
          <input
            type="number"
            step="any"
            min={-90}
            max={90}
            required
            className="w-full p-2 border rounded-md mb-2"
            name="latitude"
            value={farmLatitude || ""}
            onChange={(e) => setFarmLatitude(e.target.value)}
          />
          
          <div className="flex justify-between mt-4">
            <button 
              type="submit"
              className="bg-green-700 text-white py-2 px-4 rounded-md w-1/2 cursor-pointer"
            >
              Lưu
            </button>

            <button 
              type="button"
              onClick={handleCancel} 
              className="bg-neutral-500 text-white py-2 px-4 rounded-md w-1/2 ml-3 cursor-pointer"
            >
              Trở về
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-md w-1/2 ml-3 cursor-pointer"
            >
              Xoá
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
