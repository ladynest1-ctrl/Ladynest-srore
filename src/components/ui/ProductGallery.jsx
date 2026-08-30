"use client";
import { useRef, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade'; // Fade effect mobile par smooth lagta hai

export default function ProductGallery({ 
  images = [], 
  colors = [], 
  name, 
  selectedColor, 
  setSelectedColor 
}) {
  const swiperRef = useRef(null);
  const activeIndex = colors.length > 0 && selectedColor
    ? Math.max(
        0,
        colors.findIndex((color) => color.toLowerCase() === selectedColor.toLowerCase())
      )
    : 0;

  // Sync Gallery jab bahar se color select ho
  useEffect(() => {
    if (selectedColor && swiperRef.current && colors.length > 0) {
      const colorIdx = colors.findIndex(c => c.toLowerCase() === selectedColor.toLowerCase());
      if (colorIdx !== -1 && swiperRef.current.activeIndex !== colorIdx) {
        swiperRef.current.slideTo(colorIdx);
      }
    }
  }, [selectedColor, colors]);

  const allImages = useMemo(() => {
    if (Array.isArray(images)) return images;
    try { 
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch { 
      return images ? [images] : []; 
    }
  }, [images]);

  // Agar images na hon toh placeholder dikhayein taake screen blank na ho
  if (allImages.length === 0) {
    return (
      <div className="aspect-[4/5] w-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
        No Image Available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      <div className="relative aspect-[4/5] bg-white border border-black/[0.05] overflow-hidden rounded-sm group shadow-sm">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Navigation, Pagination, EffectFade]}
          navigation={true}
          pagination={{ clickable: true, dynamicBullets: true }} // Mobile par dynamic bullets ache lagte hain
          effect="fade" // Images switch hote waqt blink nahi karengi
          fadeEffect={{ crossFade: true }}
          onSlideChange={(swiper) => {
            const newColor = colors[swiper.activeIndex];
            if (newColor && newColor !== selectedColor) {
              setSelectedColor(newColor); 
            }
          }}
          className="h-full w-full mySwiper"
        >
          {allImages.map((img, idx) => (
            <SwiperSlide key={idx} className="bg-white">
              <div className="relative h-full w-full">
                <Image 
                  src={img} 
                  alt={`${name} - ${idx + 1}`} 
                  fill 
                  priority={idx === 0} // Pehli image foran load ho
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-2 md:p-6" 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnails - Mobile par scrollable ya small grid */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-5 md:gap-2">
        {allImages.map((img, idx) => (
          <button 
            key={idx} 
            onClick={() => swiperRef.current?.slideTo(idx)}
            className={`flex-shrink-0 w-16 h-16 md:w-auto md:h-auto aspect-square relative border-2 transition-all duration-300 ${
              activeIndex === idx ? 'border-black opacity-100' : 'border-transparent opacity-40'
            }`}
          >
            <Image 
              src={img} 
              alt="thumbnail" 
              fill 
              sizes="80px"
              className="object-cover p-1" 
            />
          </button>
        ))}
      </div>
    </div>
  );
}