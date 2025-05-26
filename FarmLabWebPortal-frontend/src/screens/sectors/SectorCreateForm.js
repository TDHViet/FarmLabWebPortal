import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getData, postData } from "../../libs/api";

import { Navbar } from "../../components/Navbar";


export default function SectorCreateForm() {

  const navigate = useNavigate();
  const currentFarmId = useParams().farmId;
  const [farmLabs, setFarmLabs] = useState([]);

  useEffect(() => {
    getData({
      url: "/farmlabs/",
      callback: (data) => {
        setFarmLabs(data.results);
      },
    });
  }, []);

  const handleSave = () => {
    const formData = new FormData(document.querySelector("form"));
    const body = {
      farm: formData.get("farmLab"),
      name: formData.get("name"),
      description: formData.get("description"),
    }

    postData(
      {
        url: "/sectors/",
        callback: (data) => {
          navigate(`/farms/${currentFarmId}`);
          toast.success("Thêm khu vực thành công");
        },
        body: body,
      }
    )
  }

  const handleCancel = () => {
    navigate(`/farms/${currentFarmId}`);
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
            defaultValue={currentFarmId}
            required
            className="w-full p-2 border rounded-md mb-2"
            name="farmLab"
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
          />

          <label className="block text-sm font-semibold">Mô tả</label>
          <textarea
            required
            className="w-full p-2 border rounded-md mb-2 h-20"
            name="description"
          />

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-green-700 text-white py-2 px-4 rounded-md w-1/2 mr-2 cursor-pointer"
            >
              Lưu
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-neutral-500 text-white py-2 px-4 rounded-md w-1/2 ml-2 cursor-pointer"
            >
              Trở về
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}