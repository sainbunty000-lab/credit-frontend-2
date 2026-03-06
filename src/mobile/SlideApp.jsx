import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import Home from "../pages/Home";
import WorkingCapital from "../pages/WorkingCapital";
import Agriculture from "../pages/Agriculture";
import Banking from "../pages/Banking";
import Dashboard from "../pages/Dashboard";
import Underwriting from "../pages/Underwriting";
import FinalReport from "../pages/FinalReport";

export default function SlideApp() {

  return (

    <Swiper
      spaceBetween={50}
      slidesPerView={1}
    >

      <SwiperSlide>
        <Home/>
      </SwiperSlide>

      <SwiperSlide>
        <WorkingCapital/>
      </SwiperSlide>

      <SwiperSlide>
        <Agriculture/>
      </SwiperSlide>

      <SwiperSlide>
        <Banking/>
      </SwiperSlide>

      <SwiperSlide>
        <Dashboard/>
      </SwiperSlide>

      <SwiperSlide>
        <Underwriting/>
      </SwiperSlide>

      <SwiperSlide>
        <FinalReport/>
      </SwiperSlide>

    </Swiper>

  );
}
