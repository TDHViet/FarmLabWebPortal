import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { getData } from "../../libs/api";


const darkenColor = (color) => {
  // Convert hex to RGB
  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);
  // Calculate the new RGB values
  r = Math.max(0, Math.min(255, r - 150));
  g = Math.max(0, Math.min(255, g - 150));
  b = Math.max(0, Math.min(255, b - 150));
  // Convert back to hex
  const newColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  return newColor;
};


const DeviceCard = ({ device }) => {
  const handleClick = (event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the outer card
  };

  return (
    <a
      href={`/farms/${device.farm}/${device.id}/edit-device`}
      key={device.id}
      className={`p-4 rounded-lg shadow cursor-pointer mb-2 shadow-lg`}
      onClick={handleClick}
      style={{ backgroundColor: device.device_type_data.color }}
    >
      <div className="grid grid-cols-2">

        <div>
          <h4
            className="font-bold text-lg"
            style={{ color: darkenColor(device.device_type_data.color) }}
          >
            {device.name}
          </h4>
          <p className="text-sm text-gray-700">{device.device_type_data.name}</p>
        </div>

        <div className="flex items-center justify-end">
          <p
            className="text-xl font-bold"
            style={{ color: darkenColor(device.device_type_data.color) }}
          >{device.value} {device.device_type_data.unit}</p>
        </div>

      </div>
    </a>
  );
};


function FarmDetail() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    getData({
      url: `/farmlabs/${farmId}/`,
      callback: (data) => setFarm(data),
    });

    getData({
      url: `/sectors/`,
      callback: (data) => setSectors(data.results),
      params: { farm: farmId },
    });

    getData({
      url: `/devices/`,
      callback: (data) => setDevices(data.results),
      params: { farm: farmId },
    });
  }, [farmId]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            {farm && (
              <div className="bg-white p-4 rounded-lg border-2 border-green-800 shadow-lg">
                <h2 className="text-2xl font-bold">{farm.name}</h2>
                <p>Chủ: {farm.owner_data.first_name} {farm.owner_data.last_name}</p>
                <p>Địa chỉ: {farm.address}</p>
                <p>
                  Kinh độ: {farm.longitude} - Vĩ độ: {farm.latitude}
                </p>
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap gap-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded w-full md:w-58 cursor-pointer"
                onClick={() => navigate(`/farms/${farmId}/visualization`)}
              >
                Xem số liệu
              </button>
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded w-full md:w-58 cursor-pointer"
                onClick={() => navigate(`/farms/${farmId}/edit-farm`)}
              >
                Cập nhật thông tin FarmLab
              </button>
              <button
                className="bg-green-700 text-white py-2 px-4 rounded w-full md:w-58 cursor-pointer"
                onClick={() => navigate(`/farms/${farmId}/create-sector`)}
              >
                Thêm khu vực mới
              </button>
              <button
                className="bg-green-700 text-white py-2 px-4 rounded w-full md:w-58 cursor-pointer"
                onClick={() => navigate(`/farms/${farmId}/create-device`)}
              >
                Thêm thiết bị mới
              </button>

            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {sectors.map((sector) => {
            const sectorDevices = devices.filter((device) => device.sector === sector.id);

            return (
              <div
                href={`/farms/${sector.farm}/${sector.id}/edit-sector`}
                key={sector.id}
                className="bg-green-100 p-6 rounded-lg shadow w-full cursor-pointer"
                onClick={() => navigate(`/farms/${sector.farm}/${sector.id}/edit-sector`)}
              >
                {
                  sectorDevices.length === 1 ? (
                    // Layout for sectors with only one device
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-bold text-xl mb-2">{sector.name}</h3>
                        <p className="text-sm text-gray-700 mb-4">{sector.description}</p>
                      </div>
                      <DeviceCard device={sectorDevices[0]} />

                    </div>
                  ) : (
                    // Layout for sectors with multiple devices
                    <div>
                      <h3 className="font-bold text-xl mb-2">{sector.name}</h3>
                      <p className="text-sm text-gray-700 mb-4">{sector.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sectorDevices.map((device) => (
                          <DeviceCard key={device.id} device={device} />
                        ))}
                      </div>
                    </div>
                  )
                }
              </div>
            );
          })}

          <div className="bg-white p-6 rounded-lg shadow w-full border-1 shadow-lg">
            <h3 className="font-bold text-xl mb-3">Thiết bị không thuộc khu vực</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices
                .filter((device) => !device.sector)
                .map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


export default FarmDetail;