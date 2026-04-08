import React, { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    initials: "W",
    name: "Wanjiru M.",
    role: "Form 4 Student, Nairobi",
    text: "My Maths grade jumped from a D to a B+ after three months with Summit Scholars Hub. The structured lessons and weekly feedback really made the difference for my KCSE preparation.",
  },
  {
    initials: "K",
    name: "Kevin O.",
    role: "Form 2 Student, Mombasa",
    text: "I used to fear Chemistry but my tutor at Summit Scholars Hub broke everything down so clearly. Now it is one of my best subjects. My parents are very happy with my progress reports.",
  },
  {
    initials: "A",
    name: "Aisha F. (Parent)",
    role: "Guardian, Kisumu",
    text: "What I love most is the accountability. After every lesson I receive a report on what was covered and how my daughter performed. Summit Scholars Hub is truly committed to our children's success.",
  },
  {
    initials: "B",
    name: "Brian N.",
    role: "Form 3 Student, Nakuru",
    text: "The Google Meet sessions are so convenient. I can learn from home without wasting time on transport. My English essay skills have improved tremendously and my teacher at school noticed too.",
  },
  {
    initials: "F",
    name: "Fatuma A.",
    role: "Form 1 Student, Eldoret",
    text: "Starting secondary school was scary but my Summit Scholars Hub tutor helped me build a strong foundation in all subjects from the very beginning. I feel very confident now.",
  },
  {
    initials: "J",
    name: "John K. (Parent)",
    role: "Guardian, Thika",
    text: "Affordable pricing, qualified teachers, and real results. Summit Scholars Hub is the best investment we have made for our son's education. His KCSE mock results speak for themselves.",
  },
];

const TestimonialSection = () => {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-[#f8f6f0]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#1a3a6b]">
              Student Success Stories
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Real results from students and families across Kenya
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-l-4 border-l-[#c9a227]">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a3a6b]">
                    <span className="font-semibold text-[#c9a227]">{t.initials}</span>
                  </div>
                  <div>
                    <CardTitle className="text-base text-[#1a3a6b]">{t.name}</CardTitle>
                    <CardDescription>{t.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#c9a227] text-[#c9a227]" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">{t.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(TestimonialSection);
