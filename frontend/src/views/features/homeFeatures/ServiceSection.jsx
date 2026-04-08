import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, GraduationCap, Star, Calculator, FlaskConical, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: BookOpen,
    title: "English & Kiswahili",
    description: "Comprehensive language tutoring for KCSE and CBC",
    items: [
      "Grammar, composition & comprehension",
      "Essay writing & oral skills",
      "Literature & poetry analysis",
      "KCSE exam preparation",
      "CBC competency-based learning",
    ],
  },
  {
    icon: Calculator,
    title: "Mathematics",
    description: "Clear and effective maths instruction for all Form levels",
    items: [
      "Algebra, geometry & trigonometry",
      "Statistics and probability",
      "Problem-solving strategies",
      "KCSE past paper practice",
      "Advanced topics for Form 3 & 4",
    ],
  },
  {
    icon: FlaskConical,
    title: "Sciences",
    description: "Biology, Chemistry & Physics for secondary school",
    items: [
      "Biology: cells, genetics, ecology",
      "Chemistry: reactions, bonding, organic",
      "Physics: mechanics, electricity, waves",
      "Practical experiment guidance",
      "KCSE science exam focus",
    ],
  },
  {
    icon: Globe,
    title: "Humanities & Business",
    description: "History, Geography, CRE & Business Studies",
    items: [
      "History & Government (Kenya focus)",
      "Geography: physical & human",
      "CRE and IRE",
      "Business Studies & Economics",
      "Map work and field study skills",
    ],
  },
];

const ServiceSection = () => {
  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#1a3a6b]">
              Our Tutoring Services
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Structured online lessons covering all core KCSE and CBC subjects for Form 1–4 students.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="border-t-4 border-t-[#1a3a6b]">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-6 w-6 text-[#c9a227]" />
                    <CardTitle className="text-[#1a3a6b]">{service.title}</CardTitle>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-[#c9a227] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#1a3a6b] hover:bg-[#0f2548]" asChild>
                    <a href="#contact">Book {service.title} Tutoring</a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(ServiceSection);

