import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getData, postData } from "../../libs/api";

import { Navbar } from "../../components/Navbar";


export default function DeviceCreateForm() {

  const navigate = useNavigate();
  const farmId = useParams().farmId;
  const [farmLabs, setFarmLabs] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);

  useEffect(() => {
    getData({
      url: "/farmlabs/",
      callback: (data) => {
        setFarmLabs(data.results);
      },
    });
  }, []);

  useEffect(() => {
    getData({
      url: "/device-types/",
      callback: (data) => {
        setDeviceTypes(data.results);
      },
    });
  }, []);

  const updateSectorList = (farmId) => {
    const sectorSelector = document.querySelector("select[name=sector]");
    sectorSelector.innerHTML = "";
    farmLabs.filter(farmLab => farmLab.id === parseInt(farmId)).map((farmLab) => (
      farmLab.sectors.map((sector) => {
        const option = document.createElement("option");
        option.key = sector.id;
        option.value = sector.id;
        option.innerHTML = sector.name;
        sectorSelector.appendChild(option);
        return null;
      })
    ))
    const option = document.createElement("option");
    option.key = 0;
    option.value = 0;
    option.innerHTML = "Khác";
    sectorSelector.appendChild(option);
  }

  const handleSave = () => {
    const formData = new FormData(document.querySelector("form"));
    const body = {
      farm: formData.get("farmLab"),
      sector: formData.get("sector") === "0" ? null : formData.get("sector"),
      name: formData.get("name"),
      code: formData.get("code"),
      device_type: formData.get("deviceType"),
    }

    postData(
      {
        url: "/devices/",
        callback: (data) => {
          navigate(`/farms/${farmId}`);
          toast.success("Thêm thiết bị thành công");
        },
        body: body,
      }
    )
  }

  const handleCancel = () => {
    navigate(`/farms/${farmId}`);
  }

  return (
    <div className="flex flex-col h-screen">

      <Navbar />

      <form
        className="flex justify-center items-center flex-grow px-4"
        onSubmit={(e) => { e.preventDefault(); handleSave() }}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg border w-full max-w-3xl mx-auto">

          <h2 className="text-center font-bold text-xl mb-4">Thông tin Thiết bị</h2>

          <label className="block text-sm font-semibold">Farm Lab</label>
          <select
            default_value={farmId}
            onChange={(e) => updateSectorList(e.target.value)}
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

          <label className="block text-sm font-semibold">Khu vực</label>
          <select
            default_value={null}
            className="w-full p-2 border rounded-md mb-2"
            name="sector"
          >
            {
              farmLabs.filter(farmLab => farmLab.id === parseInt(farmId)).map((farmLab) => (
                farmLab.sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))
              ))
            }
            <option key={0} value={0}>Khác</option>
          </select>

          <label className="block text-sm font-semibold">Tên thiết bị</label>
          <input
            type="text"
            maxLength={255}
            required
            className="w-full p-2 border rounded-md mb-2"
            name="name"
          />

          <label className="block text-sm font-semibold">Mã thiết bị</label>
          <input
            type="text"
            maxLength={255}
            required
            className="w-full p-2 border rounded-md mb-2"
            name="code"
          />

          <label className="block text-sm font-semibold">Phân loại</label>
          <select
            className="w-full p-2 border rounded-md mb-2"
            name="deviceType"
            required
          >
            {deviceTypes.map((deviceType) => (
              <option key={deviceType.id} value={deviceType.id}>
                {deviceType.name}
              </option>
            ))}
          </select>

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