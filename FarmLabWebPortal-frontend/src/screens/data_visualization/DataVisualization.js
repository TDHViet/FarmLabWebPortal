import React, { useEffect, useState, useCallback } from 'react'; 

import { useParams } from 'react-router-dom';

import 'lucide-react';

import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { Navbar } from '../../components/Navbar.js';
import { getData } from '../../libs/api';


const colors = ['#3b82f6', '#ff7300', '#22c55e', '#ef4444', '#a855f7'];


const processData = (dataArray) => {
  const grouped = {};
  dataArray.forEach((item) => {
    if (!grouped[item.time]) {
      grouped[item.time] = { time: item.time };
    }
    grouped[item.time][item.sensor] = item.value;
  });

  return Object.values(grouped).sort((a, b) => new Date(a.time) - new Date(b.time));
};


const GenericChart = ({ data, chartType }) => {
  const processed = processData(data);
  if (!processed.length) return null;

  const keys = Object.keys(processed[0]).filter(k => k !== 'time');

  return (
    <ResponsiveContainer width="100%" height={300}>
      {chartType === 'line' ? (
        <LineChart data={processed}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ angle: -45, fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip />
          <Legend />
          {keys.map((sensor, i) => (
            <Line
              key={sensor}
              type="monotone"
              dataKey={sensor}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          ))}
        </LineChart>
      ) : (
        <BarChart data={processed}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ angle: -45, fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip />
          <Legend />
          {keys.map((sensor, i) => (
            <Bar
              key={sensor}
              dataKey={sensor}
              fill={colors[i % colors.length]}
            />
          ))}
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};


const DataVisualization = () => {
  const { farmId } = useParams();
  const [devices, setDevices] = useState([]);
  const [chartTypes, setChartTypes] = useState({});
  const [startDate, setStartDate] = useState('2025-04-28T07:00');
  const [endDate, setEndDate] = useState('2025-05-10T07:00');
  const [pendingStartDate, setPendingStartDate] = useState(startDate);
  const [pendingEndDate, setPendingEndDate] = useState(endDate);
  const [selectedSector, setSelectedSector] = useState('all');

  const presets = {
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
  };

  const fetchData = useCallback(() => {
    if (!startDate || !endDate) return;

    const params = {
      farm: farmId,
      start_time: new Date(startDate).toISOString(),
      end_time: new Date(endDate).toISOString()
    };

    getData({
      url: `/devices/time-series/`,
      params,
      callback: (response) => {
        const rawData = response.data || {};
        const filteredDevices = Object.entries(rawData)
          .map(([id, dev]) => {
            if (dev.farm_data?.id !== parseInt(farmId)) return null;

            const sensorName = dev.device_type_data?.name || dev.code || 'Sensor';
            const data = (dev.values || [])
              .filter(item => item.value !== 'nan')
              .map(item => {
                const rawTime = new Date(item.ts);
                return {
                  time: rawTime.toISOString(),
                  displayTime: rawTime.toLocaleString('vi-VN', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                    day: '2-digit', month: '2-digit', hour12: false
                  }),
                  sensor: sensorName,
                  value: parseFloat(item.value)
                };
              });

            return {
              id,
              name: dev.name,
              sector_data: dev.sector_data,
              data: data.sort((a, b) => new Date(a.time) - new Date(b.time))
            };
          })
          .filter(Boolean);

        setDevices(filteredDevices);
      }
    });
  }, [farmId, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectChange = (id, type) => {
    setChartTypes(prev => ({ ...prev, [id]: type }));
  };

  const applyTimeRange = () => {
    setStartDate(pendingStartDate);
    setEndDate(pendingEndDate);
  };

  const sectorOptions = Array.from(new Set(devices.map(dev => dev.sector_data?.id ? JSON.stringify({ id: dev.sector_data.id, name: dev.sector_data.name }) : null).filter(Boolean)))
    .map(item => JSON.parse(item));

  return (
    <div>
      <Navbar title="Data Visualization" />
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex gap-4 mb-6 flex-wrap items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="datetime-local"
              className="border px-2 py-1 rounded"
              value={pendingStartDate}
              onChange={(e) => setPendingStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="datetime-local"
              className="border px-2 py-1 rounded"
              value={pendingEndDate}
              onChange={(e) => setPendingEndDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preset Range</label>
            <select
              className="border px-2 py-1 rounded"
              onChange={(e) => {
                if (!e.target.value) return;
                const now = new Date();
                const past = new Date(now.getTime() - presets[e.target.value]);
                const format = (d) => d.toISOString().slice(0, 16);
                const newStart = format(past);
                const newEnd = format(now);
                setPendingStartDate(newStart);
                setPendingEndDate(newEnd);
                setStartDate(newStart);
                setEndDate(newEnd);
              }}
            >
              <option value="">-- Chọn nhanh --</option>
              <option value="15m">15 phút qua</option>
              <option value="30m">30 phút qua</option>
              <option value="1h">1 giờ qua</option>
              <option value="4h">4 giờ qua</option>
              <option value="12h">12 giờ qua</option>
              <option value="1d">1 ngày qua</option>
              <option value="1w">1 tuần qua</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Khu vực</label>
            <select
              className="border px-2 py-1 rounded"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            >
              <option value="all">Tất cả</option>
              {sectorOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          </div>
          <div className='ml-auto'>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded"
              onClick={applyTimeRange}
            >
              Áp dụng
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {devices
            .filter(dev => selectedSector === 'all' || dev.sector_data?.id === selectedSector)
            .map((dev) => {
              const displayData = dev.data.map(item => ({
                ...item,
                time: item.displayTime
              }));

              return (
                <div key={dev.id} className="bg-white p-4 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold">{dev.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {dev.sector_data?.name || 'Không rõ khu vực'}
                  </p>
                  <select
                    className="px-2 py-1 border rounded mb-4"
                    value={chartTypes[dev.id] || 'line'}
                    onChange={(e) => handleSelectChange(dev.id, e.target.value)}
                  >
                    <option value="line">📈 Lines</option>
                    <option value="bar">📊 Columns</option>
                  </select>
                  <GenericChart data={displayData} chartType={chartTypes[dev.id] || 'line'} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;