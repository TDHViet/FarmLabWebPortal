// user date from API
export const preparedData = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    username: `user${i + 1}`,
    lastName: "Nguyễn Văn",
    firstName: "A",
    email: `email${i + 1}@example.com`,
    role: i % 2 === 0 ? "Manager" : "FarmLab owner",
    status: i % 2 === 0 ? "Active" : "Not active",
}));
export const sensorData = {
    temp: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      sensor: 'sensor1',
      value: Math.floor(Math.random() * 10) + 20, // Nhiệt độ từ 20 đến 30
    })).concat(
      Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        sensor: 'sensor2',
        value: Math.floor(Math.random() * 10) + 18, // Nhiệt độ từ 18 đến 28
      }))
    ).concat(
      Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        sensor: 'sensor3',
        value: Math.floor(Math.random() * 10) + 22, // Nhiệt độ từ 22 đến 32
      }))
    ),
  
    humidity: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      sensor: 'sensor1',
      value: Math.floor(Math.random() * 30) + 40, // Độ ẩm từ 40% đến 70%
    })).concat(
      Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        sensor: 'sensor2',
        value: Math.floor(Math.random() * 30) + 35, // Độ ẩm từ 35% đến 65%
      }))
    ).concat(
      Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        sensor: 'sensor3',
        value: Math.floor(Math.random() * 30) + 45, // Độ ẩm từ 45% đến 75%
      }))
    ),
  };