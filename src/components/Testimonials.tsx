import React from "react";

interface Testimonial {
  name: string;
  quote: string;
  avatar?: string;
  rating?: number;
  location?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

// Default avatars if none provided
const defaultAvatars = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
];

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  // Generate star ratings
  const renderStars = (rating: number = 5) => {
    return (
      <div className="flex items-center justify-center mb-3" role="img" aria-label={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-5 h-5 ${i < rating ? 'text-yellow-500' : 'text-gray-300'} transition-all duration-300`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section id="testimonials" className="py-16 px-4 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-center mb-3" style={{color:'#3E7C59'}}>
        What Our Community Says
      </h2>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Real experiences from people who are part of our sustainable marketplace
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary"
            tabIndex={0}
          >
            <div className="relative mb-4">
              <img 
                src={t.avatar || defaultAvatars[idx % defaultAvatars.length]} 
                alt={`${t.name}'s profile`} 
                className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                loading="lazy"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {renderStars(t.rating)}
            
            <p className="italic mb-4 text-gray-700 leading-relaxed">"{t.quote}"</p>
            
            <div className="mt-auto">
              <div className="font-bold text-primary text-lg" style={{color:'#3E7C59'}}>{t.name}</div>
              {t.location && (
                <div className="text-sm text-gray-500 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t.location}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
