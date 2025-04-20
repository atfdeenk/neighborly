import React from "react";

interface Testimonial {
  name: string;
  quote: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => (
  <section id="testimonials" className="py-16 px-4 max-w-4xl mx-auto w-full">
    <h2 className="text-3xl font-bold text-center text-secondary mb-10" style={{color:'#A08F79'}}>What Our Users Say</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((t, idx) => (
        <div key={idx} className="bg-accent rounded-xl shadow p-6 flex flex-col items-center text-center" style={{backgroundColor:'#D9D4CC'}}>
          <p className="italic mb-4">"{t.quote}"</p>
          <span className="font-semibold text-primary" style={{color:'#7BAE7F'}}>- {t.name}</span>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;
