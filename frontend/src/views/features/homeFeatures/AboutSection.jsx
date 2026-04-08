import React, { memo } from "react";

const AboutSection = () => {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#1a3a6b]">
              About Summit Scholars Hub
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              An online tutoring platform dedicated to helping high school students (Form 1–4) improve their
              academic performance through structured, scheduled, and well-guided online lessons.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <img
            src="https://media.istockphoto.com/id/1468140092/photo/happy-elementary-students-raising-their-hands-on-a-class-at-school.jpg?s=612x612&w=0&k=20&c=BrkqxwR_nW4WzbDCAmpQEyF-QYvML9EktH4hhCj-76U="
            width={400}
            height={400}
            alt="Summit Scholars Hub students"
            className="mx-auto aspect-square overflow-hidden rounded-2xl object-cover object-center sm:w-full lg:order-last border-4 border-[#c9a227]"
          />
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold text-[#1a3a6b]">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To become Africa's leading online academic support platform, nurturing confident,
                    disciplined, and high-performing students prepared for excellence and life beyond the classroom.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold text-[#1a3a6b]">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To provide affordable, structured, and high-quality online tutoring that empowers students
                    to understand concepts, improve performance, and achieve their full academic potential
                    through personalized guidance and consistent mentorship.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold text-[#1a3a6b]">KCSE & CBC Focus</h3>
                  <p className="text-muted-foreground">
                    Special emphasis on KCSE preparation while also supporting CBC learners — every lesson
                    is structured, every student is monitored, and every guardian is informed about progress.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(AboutSection);

