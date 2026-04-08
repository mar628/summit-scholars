import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SummitLogo from '@/assets/svgs/SummitLogo';

const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#1a3a6b] via-[#1e4080] to-[#0f2548]">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <SummitLogo size={56} />
              <div>
                <p className="text-[#c9a227] font-semibold italic text-lg">Where Excellence Meets Elevation</p>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
              Africa's Premier Online Academic Support Platform
            </h1>
            <p className="max-w-[600px] text-white/80 md:text-xl">
              Structured, affordable, and high-quality online tutoring for Form 1–4 students.
              KCSE preparation, CBC support, and personalized mentorship — all in one place.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="bg-[#c9a227] hover:bg-[#b8911f] text-white font-bold" asChild>
                <a href="#contact">Book Your First Class</a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1a3a6b]" asChild>
                <a href="#services">Explore Services</a>
              </Button>
            </div>
          </div>
          <div className="mx-auto lg:mx-0">
            <img
              src="https://thumbs.dreamstime.com/b/children-education-kid-read-book-school-boy-reading-books-dreaming-over-blackboard-background-92807607.jpg"
              width={550}
              height={550}
              alt="Summit Scholars Hub - Online tutoring for Kenyan students"
              className="rounded-2xl object-cover border-4 border-[#c9a227] shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);
