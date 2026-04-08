import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Video, GraduationCap, ClipboardList } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    step: '1',
    title: 'Book a Session',
    description: 'Choose your subject, preferred days, and time slot. We support Form 1–4 KCSE and CBC learners.',
  },
  {
    icon: Video,
    step: '2',
    title: 'Join Google Meet',
    description: 'Connect via Google Meet for a face-to-face interactive learning session from any device.',
  },
  {
    icon: GraduationCap,
    step: '3',
    title: 'Learn & Improve',
    description: 'Receive personalized instruction, structured notes, and targeted practice to boost your results.',
  },
  {
    icon: ClipboardList,
    step: '4',
    title: 'Track Your Progress',
    description: 'Get performance reports after every lesson. Guardians are kept informed of every student\'s progress.',
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#1a3a6b]">
              How It Works
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Simple, effective, and convenient — get started with Summit Scholars Hub in 4 easy steps
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.step} className="flex flex-col items-center text-center border-t-4 border-t-[#c9a227]">
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1a3a6b] text-white m-auto mb-2">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-[#c9a227] font-bold text-sm uppercase tracking-widest">Step {step.step}</div>
                  <CardTitle className="text-[#1a3a6b] text-base">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(HowItWorksSection);
