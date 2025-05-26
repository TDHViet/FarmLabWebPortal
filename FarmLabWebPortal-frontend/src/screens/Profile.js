import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import { Navbar } from '../components/Navbar';

import UserIcon from '../assets/images/profile/user-1.png';
import Email from '../assets/images/profile/envelope-outline.png';
import Gift from '../assets/images/profile/gift.png';
import Book from '../assets/images/profile/adress-book.png';
import House from '../assets/images/profile/home-outline.png';
import Location from '../assets/images/profile/map-pin.png';
import Submit from '../assets/images/profile/cart-plus.png';
import Return from '../assets/images/profile/cart-plus-1.png';
import Pen from '../assets/images/profile/pen-nib.png';

import { putData, getData } from '../libs/api';
import { loadAuthUser } from '../libs/auth';

function InputWithIcon({ image, placeholder, type, label, value, onChange, edit_icon, required }) {
  const inputId = label.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="relative">
      <label htmlFor={inputId} className="block mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <img src={image} alt="icon" />
        </span>

        <input
          id={inputId}
          className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring focus:border-blue-500"
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    </div>
  );
}

const UserForm = ({ user }) => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(user || {});
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const updateUserData = async () => {
    putData({
      url: `/users/${formData.id}/`,
      callback: (message) => {
        toast.success("Chỉnh sửa thông tin thành công");
        console.log(formData);
      },
      body: {
        username: formData.username,
        role: formData.role,
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        email: formData.email,
        phone_number: formData.phone_number,
        address: formData.address,
        province: formData.province,
        active: formData.active,
      },
    });
  };

  return (
    <div className="p-4 sm:p-8 rounded-2xl shadow-xl w-full min-h-screen bg-white flex justify-center items-center">
      <div className="w-full max-w-[700px]">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Thông Tin Tài Khoản</h2>
        <h3 className="text-xl mb-6">Username: {formData.username}</h3>
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            if (!e.target.checkValidity()) {
              formRef.current.reportValidity();
              return;
            }
            updateUserData();
          }}
          className="w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputWithIcon
              image={UserIcon}
              type="text"
              label="Tên"
              value={formData.first_name || ""}
              onChange={handleChange("first_name")}
              edit_icon={Pen}
            />
            <InputWithIcon
              image={UserIcon}
              type="text"
              label="Họ"
              value={formData.last_name || ""}
              onChange={handleChange("last_name")}
              edit_icon={Pen}
            />
            <InputWithIcon
              image={Email}
              type="email"
              label="Email"
              placeholder="abc@gmail.com"
              value={formData.email || ""}
              onChange={handleChange("email")}
              edit_icon={Pen}
              required
            />
            <InputWithIcon
              image={Gift}
              type="date"
              label="Ngày sinh"
              value={formData.date_of_birth || ""}
              onChange={handleChange("date_of_birth")}
            />
            <InputWithIcon
              image={Book}
              type="tel"
              label="Số điện thoại"
              placeholder=""
              value={String(formData.phone_number || "")}
              onChange={handleChange("phone_number")}
              edit_icon={Pen}
            />
            <InputWithIcon
              image={House}
              type="text"
              label="Tỉnh"
              placeholder=""
              value={formData.province || ""}
              onChange={handleChange("province")}
              edit_icon={Pen}
            />
            <div className="col-span-1 sm:col-span-2">
              <InputWithIcon
                image={Location}
                type="text"
                label="Địa chỉ"
                placeholder="Địa chỉ chi tiết"
                value={formData.address || ""}
                onChange={handleChange("address")}
                edit_icon={Pen}
              />
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <button
              type="submit"
              className="w-full sm:w-48 h-10 bg-green-600 hover:bg-green-700 rounded-xl text-white flex items-center justify-center space-x-2"
            >
              <img src={Submit} alt="Xác nhận" className="w-5 h-5" />
              <span>Xác nhận</span>
            </button>
            <button
              type="button"
              className="w-full sm:w-48 h-10 bg-gray-500 hover:bg-gray-600 rounded-xl text-white flex items-center justify-center space-x-2"
              onClick={() => navigate(-1)}
            >
              <img src={Return} alt="Trở về" className="w-5 h-5" />
              <span>Trở về</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


function ManageProfile() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = loadAuthUser();
    if (storedUser && storedUser.id) {
      fetchUserFromServer(storedUser.id);
    }
  }, []);

  const fetchUserFromServer = async (id) => {
    await getData({
      url: `/users/${id}/`,
      callback: (data) => {
        setUser(data);
      },
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <hr />
      <div className="flex-1 px-4 sm:px-8 pt-20"> {/* pt-20 ~ 80px to avoid overlay */}
        {user && <UserForm user={user} />}
      </div>
    </div>
  );
}


export default ManageProfile;