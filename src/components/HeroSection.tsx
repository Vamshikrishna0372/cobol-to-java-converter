import { Zap, Shield, Clock } from 'lucide-react';

export default function HeroSection() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Convert your COBOL code to Java in seconds',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your code is processed securely and never stored',
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Reduce weeks of manual migration to minutes',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
          Transform Legacy COBOL
          <span className="block text-blue-600 mt-2">into Modern Java</span>
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Automatically convert your COBOL applications to Java with our
          intelligent code conversion tool. Maintain business logic while
          modernizing your codebase.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-slate-200"
            >
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
