import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/images/logo.png';
import user from '../assets/images/user.png';
import { loadAuthUser } from '../libs/auth';
import { postData } from '../libs/api';


export function Navbar() {

  const [authUser, setAuthUser] = useState(loadAuthUser());
  const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);
  const toggleUserMenu = () => setIsOpenUserMenu(!isOpenUserMenu);
  const navigate = useNavigate();

  const handleLogin = () => {
    postData(
      {
        url: "/login/",
        callback: (data) => {
          localStorage.setItem("accessToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setAuthUser(data.user);
          navigate("/farms");
        },
        body: {
          username: process.env.REACT_APP_USERNAME,
          password: process.env.REACT_APP_PASSWORD,
        },
      }
    )
  }

  return (
    <div className="header flex flex-wrap items-center justify-between bg-white shadow p-4">
      <a href="/farms" className="flex items-center gap-2 min-w-0">
        <img src={logo} alt="logo" className="h-8 sm:h-10 flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl font-bold text-green-600 truncate">
          FarmLab
        </h1>
      </a>
  
      <div className="relative mt-2 sm:mt-0">
        {authUser.username ? (
          <button
            onClick={toggleUserMenu}
            className="inline-flex items-center gap-2 bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
          >
            <span className="truncate max-w-[120px] sm:max-w-none">
              {authUser.username}
            </span>
            <img src={user} alt="user" className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="inline-flex items-center gap-2 bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
          >
            <span>Đăng Nhập</span>
          </button>
        )}
  
        {isOpenUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg z-9999">
            <ul>
              <li>
                <a
                  className="block p-2 hover:bg-gray-100 cursor-pointer"
                  href="/profile"
                >
                  Quản Lý Hồ Sơ
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="block p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("user");
                  }}
                >
                  Đăng Xuất
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
