import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, Star, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Single Session',
    price: 'KSh ',
    period: 'Per 1-hour session',
    description: 'Perfect for trying out or one-off revision help',
    featured: false,
    items: [
      { icon: Clock, text: '60-minute one-on-one online lesson' },
      { icon: Star, text: 'Personalized instruction' },
      { icon: Star, text: 'Practice materials included' },
      { icon: Star, text: 'Session feedback report' },
    ],
    cta: 'Book Now',
  },
  {
    name: 'Weekly Package',
    price: 'KSh ',
    period: '4 sessions/month (KSh 450/session)',
    description: 'Our most popular plan for consistent progress',
    featured: true,
    items: [
      { icon: Clock, text: 'Four 60-minute sessions per month' },
      { icon: Star, text: 'Consistent weekly progress tracking' },
      { icon: Star, text: 'Homework help included' },
      { icon: Star, text: 'Monthly performance report to guardian' },
      { icon: Star, text: 'Priority scheduling' },
    ],
    cta: 'Best Value',
  },
  {
    name: 'Intensive Package',
    price: 'KSh ',
    period: '8 sessions/month (KSh 400/session)',
    description: 'Ideal for KCSE exam preparation',
    featured: false,
    items: [
      { icon: Clock, text: 'Eight 60-minute sessions per month' },
      { icon: Star, text: 'Twice-weekly sessions' },
      { icon: Star, text: 'Comprehensive KCSE exam prep' },
      { icon: Star, text: 'Full guardian progress updates' },
      { icon: Zap, text: 'Past paper intensive practice' },
    ],
    cta: 'Book Now',
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#1a3a6b]">
              Affordable Pricing
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Quality education at reasonable rates — all prices in Kenya Shillings (KSh)
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${plan.featured ? 'border-[#1a3a6b] border-2 shadow-xl' : ''}`}
            >
              <CardHeader className={plan.featured ? 'bg-[#1a3a6b] text-white rounded-t-lg pt-6 pb-4' : ''}>
                {plan.featured && (
                  <div className="text-xs font-bold uppercase tracking-widest text-[#c9a227] mb-1">⭐ Most Popular</div>
                )}
                <CardTitle className={plan.featured ? 'text-white' : 'text-[#1a3a6b]'}>
                  {plan.name}
                </CardTitle>
                <div className={`text-3xl font-bold ${plan.featured ? 'text-[#c9a227]' : 'text-[#1a3a6b]'}`}>
                  {plan.price}
                </div>
                <CardDescription className={plan.featured ? 'text-white/80' : ''}>
                  {plan.period}
                </CardDescription>
                <p className={`text-sm mt-1 ${plan.featured ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="flex-1 pt-6">
                <ul className="space-y-2 text-sm">
                  {plan.items.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <li key={i} className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[#c9a227] flex-shrink-0" />
                        <span>{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${plan.featured ? 'bg-[#c9a227] hover:bg-[#b8911f] text-white font-bold' : 'bg-[#1a3a6b] hover:bg-[#0f2548] text-white'}`}
                  asChild
                >
                  <a href="#contact">{plan.cta}</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          💳 Payment via M-Pesa, bank transfer, or mobile money accepted
        </p>
      </div>
    </section>
  );
};

export default memo(PricingSection);
