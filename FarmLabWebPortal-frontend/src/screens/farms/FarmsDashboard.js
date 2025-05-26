import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import map_pin from "../../assets/images/pin.png";
import { getData } from "../../libs/api";

import { Navbar } from "../../components/Navbar";

const map_pin_icon = new L.Icon({
  iconUrl: new URL(map_pin, import.meta.url).href,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});


function MapUpdater({ selectedFarm }) {
  const map = useMap();

  useEffect(() => {
    if (map && map._loaded && selectedFarm) {
      map.flyTo([selectedFarm.latitude, selectedFarm.longitude], 14, { duration: 1.5 });
    }
  }, [selectedFarm, map])

  return null;
}


function FarmCard({ id, name, ownerName, address, onClick, onMouseEnter }) {
  return (
    <div
      key={id}
      className="p-4 rounded-lg shadow mb-2 cursor-pointer transition-all 
      duration-300 bg-white hover:border-2 hover:border-green-500"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <h3 className="font-semibold text-green-700">{name}</h3>
      <p className="text-sm">Chủ: {ownerName}</p>
      <p className="text-sm">Địa chỉ: {address}</p>
    </div>
  );
}


function FarmCreateCard() {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => { navigate("/farms/create-farm") }}
      className="p-2 rounded-lg shadow cursor-pointer transition-all duration-300 bg-white hover:border-2 hover:border-green-500 text-center">
      <p style={{ fontSize: "3rem" }}>+</p>
    </div>
  );
}


export default function FarmsDashboard() {
  const [loading, setLoading] = useState(true);
  const [farmLabs, setFarmLabs] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getData(
      {
        url: "/farmlabs/",
        callback: (data) => {
          setFarmLabs(data.results);
          setSelectedFarm(data.results[0]);
          setLoading(false);
        }
      }
    )
  }, []);

  return (
    <div className="flex flex-col h-screen">

      <Navbar />

      <div className="flex h-full">

        {/* Farm List */}
        <div className="w-1/3 bg-gray-100 p-4 flex flex-col overflow-hidden h-full">
          <h2 className="text-xl font-bold mb-4">Danh sách Farm Lab</h2>
          <div className="h-full overflow-auto">
            {
              loading ? <p>Loading...</p> : farmLabs.map((farm) => (
                <FarmCard
                  id={farm.id}
                  key={farm.id}
                  name={farm.name}
                  ownerName={farm.owner_data.first_name + " " + farm.owner_data.last_name}
                  address={farm.address}
                  onClick={() => {
                    navigate(`/farms/${farm.id}`);
                  }}
                  onMouseEnter={() => {
                    setSelectedFarm(farm);
                  }}
                />
              ))
            }
            <FarmCreateCard />
          </div>
        </div>

        {/* Map */}
        <div className="w-2/3 h-full">
          {
            loading ? <p>Loading map...</p> : <MapContainer center={[10.8815223, 105.4491924]} zoom={13} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {
                farmLabs.map((farm) => (
                  <Marker key={farm.id} position={[farm.latitude, farm.longitude]} icon={map_pin_icon} />
                ))
              }
              <MapUpdater selectedFarm={selectedFarm} />
            </MapContainer>
          }

        </div>
      </div>
    </div>
  );
}
