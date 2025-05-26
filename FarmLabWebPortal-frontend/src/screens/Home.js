import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { loadAuthUser } from '../libs/auth';

import "swiper/css";
import "swiper/css/pagination";

import { Navbar } from '../components/Navbar';

import logo from '../assets/images/home/logo-without-background.png';
import SmartFarming from '../assets/images/home/smart-farming.png';
import ValueImage from '../assets/images/home/center-value-image.png';
import GreenHouse from "../assets/images/home/green-house-2-min.jpg";
import Vegetable from "../assets/images/home/vegetable.png";
import Fertilizer from "../assets/images/home/fertilizer.png";
import LightBulb from "../assets/images/home/light-bulb.png";
import Watering from "../assets/images/home/water-and-plant.png";
import Sun from "../assets/images/home/green-sun.png";
import Humidity from "../assets/images/home/green-water.png";
import GreenPlant from "../assets/images/home/green-plant.png";
import Observe from "../assets/images/home/observe.png";
import Statistic from "../assets/images/home/statistic.png";
import Alert from "../assets/images/home/alert.png";
import Auto from "../assets/images/home/auto.png";
import Share from "../assets/images/home/green-people.png";
import Save from "../assets/images/home/green-earth.png";
import GreenWave from "../assets/images/home/green-background.png";


const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-green-50 overflow-hidden">
      <div className="relative w-full h-screen">
        <img
          src={GreenHouse}
          alt="Greenhouse"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green-900 opacity-20"></div>
      </div>

      {/* Overlay to darken the background */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Title + slogan overlay on image */}
      <div className="absolute inset-0 z-10 flex flex-col items-center text-center px-6 pt-[5%]">
        <div className="flex items-center gap-4 mb-4 drop-shadow-lg">
          <img src={logo} alt="logo" className="h-10" />
          <span className="text-2xl font-bold text-green-400">FarmLab</span>
        </div>
        <p className="text-xl md:text-2xl font-medium max-w-3xl drop-shadow-lg text-white">
          Từ cảm biến đến bội thu - Một hành trình công nghệ gieo trồng hôm nay, thu hoạch tương lai
        </p>
      </div>

      {/* Feature boxes near the bottom */}
      <div 
        className="absolute bottom-0 h-80 left-1/2 -translate-x-1/2 w-full px-6 lg:px-24 z-10 flex items-center justify-center"  
        style={{ backgroundImage: `url(${GreenWave})` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto justify-center">
          {[
            {
              icon: "🌾",
              title: "Nâng cao sản lượng",
              desc: "Tối ưu hóa quy trình trồng trọt với công nghệ tiên tiến, giúp tăng năng suất cây trồng.",
              image: Vegetable
            },
            {
              icon: "💧",
              title: "Tiết kiệm phân bón",
              desc: "Giảm thiểu lãng phí và tăng hiệu quả sử dụng tài nguyên đầu vào như phân bón và nước.",
              image: Fertilizer
            },
            {
              icon: "🌱",
              title: "Thân thiện môi trường",
              desc: "Hạn chế tác động đến môi trường bằng giải pháp canh tác bền vững, bảo vệ hệ sinh thái.",
              image: LightBulb
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-green-800 "
            >
              <h3 className="text-xl font-semibold mb-2">
                {item.icon} {item.title}
              </h3>
              <p className="text-sm">{item.desc}</p>
              <img
                src={item.image}
                alt="icon"
                className="absolute bottom-[-30px] right-[-30px] w-20 opacity-90"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const solutions = [
  { 
    image: Watering, 
    title: "Tưới tiêu", 
    desc: "Cảm biến độ ẩm, tự động kiểm soát lượng nước tưới phù hợp từng loại cây trồng." 
  },
  { 
    image: Sun, 
    title: "Ánh sáng", 
    desc: "Giám sát cường độ và thời gian chiếu sáng, tối ưu quang hợp cho cây." 
  },
  { 
    image: Humidity, 
    title: "Độ ẩm", 
    desc: "Cảm biến độ ẩm giúp duy trì môi trường lý tưởng quanh năm." 
  },
  { 
    image: GreenPlant, 
    title: "Dinh dưỡng đất", 
    desc: "Phân tích đất theo thời gian thực để điều chỉnh phân bón và pH hợp lý." 
  },
];


const SmartSolutionSection = () => {
  return (
    <section className="bg-white py-20 px-6 lg:px-24">
      <h1 className="text-5xl font-bold text-green-800 mb-6  border-green-500 pb-2 inline-block">
        <span className="border-b-5">Nông nghiệp</span> xanh cho hành tinh xanh
      </h1>
         
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Image */}
        <div>
          <img
            src={SmartFarming}
            alt="Smart Farming"
            className="rounded-xl shadow-lg w-full object-cover"
          />
        </div>

        {/* Right Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
            Giải pháp thông minh
          </h2>
          <ul className="space-y-6">
            {solutions.map((item, index) => (
              <li key={index} className="flex items-start space-x-4">
                
              <div className="flex items-start gap-4">
                <img src={item.image} alt="" className="w-16 h-16 object-cover" />
                <div className="flex flex-col">
                  <h4 className="text-xl font-semibold text-green-700">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};


const farmLabPortalValues = [
  { 
    image: Observe, 
    title: "Giảm chi phí & rủi ro", 
    desc: "Dự đoán và giám sát chính xác giúp nông dân yên tâm sản xuất." 
  },
  { 
    image: Alert, 
    title: "Cảnh báo thời tiết", 
    desc: "Theo dõi và phân tích thời tiết theo khu vực, đưa ra khuyến nghị hành động." 
  },
  { 
    image: Share, 
    title: "Chia sẻ mô hình canh tác", 
    desc: "Kết nối cộng đồng nông dân & chuyên gia, học hỏi lẫn nhau qua dữ liệu." 
  },
  { 
    image: Statistic, 
    title: "Phân tích và báo cáo", 
    desc: "Theo dõi năng suất, chất lượng và hiệu quả các mô hình canh tác." 
  },
  { 
    image: Auto, 
    title: "Tự động hóa quy trình", 
    desc: "Giảm lao động thủ công, nâng cao hiệu quả canh tác quy mô lớn." 
  },
  { 
    image: Save, 
    title: "Tiết kiệm tài nguyên", 
    desc: "Tối ưu nước, phân bón và năng lượng trong toàn bộ chuỗi trồng trọt." 
  },
];


const ValueSection = () => {
  const leftValues = farmLabPortalValues.slice(0, 3);
  const rightValues = farmLabPortalValues.slice(3, 6);

  return (
    <section className="bg-green-50 py-20 px-6 lg:px-24">
      <h1 className="text-5xl font-bold text-green-800 mb-6 border-green-500 pb-2 inline-block">
          <span className="border-b-5">Giá trị FarmLab</span> mang lại
      </h1>
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
          {/* Left values */}
          <div className="flex flex-col justify-between space-y-12">
            {leftValues.map((item, index) => (
              <div key={index} className="flex flex-col items-end text-right space-y-2">
                <img src={item.image} alt="Hình ảnh" className="object-cover" />
                <div>
                  <h4 className="text-xl font-semibold text-green-700 mb-1">{item.title}</h4>
                  <p className="text-gray-700 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Middle image */}
          <div className="flex justify-center items-center">
            <img
              src={ValueImage}
              alt="Giá trị FarmLab"
              className="rounded-xl shadow-lg max-w-full h-auto object-contain"
            />
          </div>

          {/* Right values */}
          <div className="flex flex-col justify-between space-y-12">
            {rightValues.map((item, index) => (
              <div key={index} className="items-start space-x-6">
                <img src={item.image} alt="Hình ảnh" />
                <div>
                  <h4 className="text-xl font-semibold text-green-700 mb-2">{item.title}</h4>
                  <p className="text-gray-700 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 text-sm">
        <p className="text-center">
          © {new Date().getFullYear()} FarmLab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}


export default function Home() {
  const navigate = useNavigate();
  const user = loadAuthUser();
  useEffect(() => {
    if (user.id) {
      navigate('/farms');
    }
  }, [user, navigate]);
  return (
    !user.id &&
    <div>
      <Navbar />
      <HeroSection />
      <SmartSolutionSection />
      <ValueSection />
      <Footer />
    </div>
  )
}