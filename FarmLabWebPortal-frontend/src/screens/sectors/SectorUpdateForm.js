import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getData, putData, deleteData } from "../../libs/api";

import { Navbar } from "../../components/Navbar";


export default function SectorUpdateForm() {

  const sectorId = useParams().sectorId;
  const currentFarmId = useParams().farmId;
  const navigate = useNavigate();

  const [sectorFarmId, setSectorFarmId] = useState("");
  const [sectorName, setSectorName] = useState("");
  const [sectorDescription, setSectorDescription] = useState("");
  const [farmLabs, setFarmLabs] = useState([]);

  useEffect(() => {
    getData({
      url: "/farmlabs/",
      callback: (data) => {
        setFarmLabs(data.results);
      },
    });
  }, []);

  useEffect(() => {
    if (sectorId) {
      getData({
        url: `/sectors/${sectorId}/`,
        callback: (data) => {
          if (data.farm && data.farm === parseInt(currentFarmId)) {
            setSectorFarmId(data.farm);
          }
          else {
            navigate("/farms");
            toast.error("Khu vực này không thuộc Farm Lab của bạn");
          }
          setSectorName(data.name);
          setSectorDescription(data.description);
        },
      });
    }
  }, [sectorId]);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    const formData = new FormData(document.querySelector("form"));
    const body = {
      farm: formData.get("farmLab"),
      name: formData.get("name"),
      description: formData.get("description"),
    }

    putData(
      {
        url: `/sectors/${sectorId}/`,
        callback: (data) => {
          navigate(`/farms/${currentFarmId}`);
          toast.success("Cập nhật khu vực thành công");
        },
        body: body,
      }
    )
  }

  const handleCancel = () => {
    navigate(`/farms/${currentFarmId}`);
  }

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xoá khu vực này không?")) {
      deleteData(
        {
          url: `/sectors/${sectorId}/`,
          callback: (data) => {
            navigate(`/farms/${currentFarmId}`);
            toast.success("Xoá khu vực thành công");
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
        onSubmit={(e) => { e.preventDefault(); handleSave() }}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg border w-full max-w-3xl mx-auto">

          <h2 className="text-center font-bold text-xl mb-4">Thông tin khu vực</h2>

          <label className="block text-sm font-semibold">Farm Lab</label>
          <select
            required
            className="w-full p-2 border rounded-md mb-2"
            name="farmLab"
            value={sectorFarmId || ""}
            onChange={(e) => setSectorFarmId(e.target.value)}
          >
            {farmLabs.map((farmLab) => (
              <option key={farmLab.id} value={farmLab.id}>
                {farmLab.name}
              </option>
            ))}
          </select>

          <label className="block text-sm font-semibold">Tên khu vực</label>
          <input
            type="text"
            maxLength={255}
            required
            className="w-full p-2 border rounded-md mb-2"
            name="name"
            value={sectorName || ""}
            onChange={(e) => setSectorName(e.target.value)}
          />

          <label className="block text-sm font-semibold">Mô tả</label>
          <textarea
            required
            className="w-full p-2 border rounded-md mb-2 h-20"
            name="description"
            value={sectorDescription || ""}
            onChange={(e) => setSectorDescription(e.target.value)}
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