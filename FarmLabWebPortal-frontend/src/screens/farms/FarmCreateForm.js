import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { postData } from "../../libs/api";
import { loadAuthUser } from "../../libs/auth";

import { Navbar } from "../../components/Navbar";


export default function FarmCreateForm() {

  const navigate = useNavigate();
  const authUser = loadAuthUser();

  const handleSave = () => {
    const formData = new FormData(document.querySelector("form"));
    const body = {
      owner: authUser.id,
      name: formData.get("name"),
      address: formData.get("address"),
      longitude: formData.get("longitude"),
      latitude: formData.get("latitude"),
    }

    postData(
      {
        url: "/farmlabs/",
        callback: (data) => {
          navigate("/farms");
          toast.success("Thêm Farm Lab thành công");
        },
        body: body,
      }
    )
  }

  const handleCancel = () => {
    navigate("/farms");
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
          />

          <label className="block text-sm font-semibold">Địa chỉ</label>
          <input
            type="text"
            maxLength={255}
            required
            className="w-full p-2 border rounded-md mb-2"
            name="address"
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