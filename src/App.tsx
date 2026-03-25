import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu as MenuIcon, X, Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { MENU_DATA } from './data';
import { HeroGeometric } from './components/ui/shape-landing-hero';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="flex items-center gap-2">
          <span className={`text-2xl font-serif font-bold tracking-tighter ${scrolled ? 'text-primary-orange' : 'text-white'}`}>
            EL VAQUERO
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`font-medium transition-colors ${scrolled ? 'text-ink hover:text-primary-orange' : 'text-white hover:text-primary-orange'}`}
            >
              {link.name}
            </a>
          ))}
          <a href="tel:6602636336" className="btn-primary py-2 px-6 text-sm">
            Call Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`md:hidden p-2 ${scrolled ? 'text-ink' : 'text-white'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden flex flex-col p-6 gap-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-ink hover:text-primary-orange"
              >
                {link.name}
              </a>
            ))}
            <a href="tel:6602636336" className="btn-primary text-center">
              Call Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1920"
          alt="Mexican Food Spread"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-teal/80 via-black/40 to-primary-orange/80" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-primary-orange/20 border border-primary-orange/30 text-primary-orange text-sm font-bold tracking-widest uppercase mb-6">
            Authentic Mexican Cuisine
          </span>
          <h1 className="text-5xl md:text-8xl text-white mb-6 leading-tight">
            Authentic Flavor.<br />
            <span className="text-primary-orange">Bold Experience.</span>
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
            Real Mexican food, done right. From sizzling fajitas to our signature quesabirria, 
            experience the heart of Mexico in Moberly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#menu" className="btn-primary text-lg">
              Explore Menu
            </a>
            <a href="#contact" className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-full font-medium hover:bg-white/20 transition-all text-lg">
              Find Us
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

const FeaturedDishes = () => {
  const [featuredImages, setFeaturedImages] = useState<Record<string, string>>({});
  const featured = MENU_DATA.flatMap(cat => cat.items).filter(item => item.featured).slice(0, 3);
  
  useEffect(() => {
    const generateImages = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const promises = featured.map(async (dish) => {
          // Skip if already has an image in data.ts (though we want to replace them with authentic ones)
          // For this request, we specifically want to generate for these 3
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
              parts: [
                {
                  text: `${dish.name}: ${dish.description}. Authentic Mexican restaurant style, vibrant colors, close-up shot, appetizing, high resolution.`,
                },
              ],
            },
            config: {
              imageConfig: {
                aspectRatio: "1:1",
                imageSize: "1K"
              },
            },
          });

          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              return { id: dish.id, data: `data:image/png;base64,${part.inlineData.data}` };
            }
          }
          return null;
        });

        const results = await Promise.all(promises);
        const newImages: Record<string, string> = {};
        results.forEach(res => {
          if (res) newImages[res.id] = res.data;
        });
        setFeaturedImages(newImages);
      } catch (error) {
        console.error('Error generating featured images:', error);
      }
    };

    generateImages();
  }, []);

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-light-teal/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-orange/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4 text-primary-teal">House Specialties</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary-teal to-primary-orange mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((dish, idx) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6">
                <img
                  src={featuredImages[dish.id] || dish.image || `https://picsum.photos/seed/${dish.id}/800/1000`}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-primary-orange text-white px-4 py-1 rounded-full text-sm font-bold">
                  {dish.price}
                </div>
              </div>
              <h3 className="text-2xl mb-2">{dish.name}</h3>
              <p className="text-ink/60 leading-relaxed">{dish.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState(MENU_DATA[0].id);

  return (
    <section id="menu" className="py-24 px-6 bg-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary-orange font-bold tracking-widest uppercase text-sm">Our Offerings</span>
          <h2 className="text-4xl md:text-6xl mt-2 mb-8 italic text-primary-teal">The Menu</h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-primary-orange to-primary-teal mx-auto rounded-full mb-12" />
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {MENU_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-primary-orange text-white shadow-lg' 
                    : 'bg-white text-ink hover:bg-white/80'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {MENU_DATA.find(c => c.id === activeCategory)?.items.map((item) => (
            <div key={item.id} className="menu-item-card flex justify-between items-start gap-4">
              <div>
                <h4 className="text-xl font-bold mb-1 text-primary-teal">{item.name}</h4>
                <p className="text-ink/60 text-sm">{item.description}</p>
              </div>
              <span className="text-primary-orange font-bold whitespace-nowrap">{item.price}</span>
            </div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <p className="text-ink/50 italic mb-8">Prices and availability are subject to change. Please inform your server of any allergies.</p>
          <a href="tel:6602636336" className="btn-outline">
            Order for Pickup
          </a>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const [logoImage, setLogoImage] = useState<string | null>(null);

  useEffect(() => {
    const generateLogo = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                text: "A professional restaurant logo for 'EL VAQUERO MEXICAN RESTAURANT'. The background features a light teal silhouette map of Mexico. The main text 'EL VAQUERO' is in a bold, orange serif font with a dark teal outline. Below it, 'MEXICAN RESTAURANT' is in a clean, dark teal sans-serif font. Above 'VAQUERO', it says 'Est. 1999' in a small dark teal font. At the bottom, there is a solid orange bar with the white text 'Moberly\'s Original Mexican Restaurant!'. The overall design is clean, high-resolution, and professional, suitable for a restaurant website.",
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1",
              imageSize: "1K"
            },
          },
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setLogoImage(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      } catch (error) {
        console.error('Error generating logo image:', error);
      }
    };

    generateLogo();
  }, []);

  return (
    <section id="about" className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern pointer-events-none" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden aspect-square shadow-2xl bg-white flex items-center justify-center p-8 border-4 border-primary-orange/20"
          >
            {logoImage ? (
              <img
                src={logoImage}
                alt="El Vaquero Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 animate-pulse rounded-2xl" />
            )}
          </motion.div>
          <div className="absolute -bottom-8 -right-8 bg-primary-teal p-8 rounded-3xl hidden md:block text-white border-4 border-primary-orange shadow-xl">
            <p className="text-4xl font-serif font-bold italic">Authentic</p>
            <p className="uppercase tracking-widest text-sm text-light-teal">Since Day One</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl mb-8 text-primary-teal">Where Tradition Meets Flavor</h2>
          <div className="space-y-6 text-lg text-ink/70 leading-relaxed">
            <p>
              El Vaquero is a casual, family-friendly Mexican restaurant in Moberly, Missouri, 
              offering a wide variety of authentic and modern Mexican dishes.
            </p>
            <p>
              Our name, "Vaquero," reflects our cowboy theme—rustic, bold, and hearty. 
              We blend traditional Mexican recipes with modern comfort food combos to create 
              an experience that appeals to both authentic and casual diners.
            </p>
            <p>
              Whether you're here for our famous sizzling fajitas, trendy quesabirria tacos, 
              or a refreshing house margarita, we promise fresh ingredients and bold spices 
              in every bite.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-8">
            <div>
              <p className="text-3xl font-serif font-bold text-primary-orange">100%</p>
              <p className="text-sm uppercase tracking-wider text-ink/50">Fresh Ingredients</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-primary-orange">Family</p>
              <p className="text-sm uppercase tracking-wider text-ink/50">Owned & Operated</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 px-6 bg-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern pointer-events-none opacity-5" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="lg:col-span-1">
            <h2 className="text-4xl mb-8">Visit Us</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary-teal/10 rounded-full flex items-center justify-center text-primary-teal shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Location</h4>
                  <p className="text-ink/70">721 North Morley Street<br />Moberly, MO 65270</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary-teal/10 rounded-full flex items-center justify-center text-primary-teal shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Phone</h4>
                  <p className="text-ink/70">(660) 263-6336</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary-teal/10 rounded-full flex items-center justify-center text-primary-teal shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Hours</h4>
                  <p className="text-ink/70">
                    Mon - Thu: 11:00 AM - 9:00 PM<br />
                    Fri - Sat: 11:00 AM - 10:00 PM<br />
                    Sun: 11:00 AM - 8:30 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="lg:col-span-2 rounded-3xl overflow-hidden h-[400px] shadow-lg relative">
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin size={48} className="mx-auto text-primary-teal mb-4" />
                <p className="text-xl font-serif italic">Interactive Map Coming Soon</p>
                <p className="text-ink/50 mt-2">721 North Morley Street, Moberly, MO</p>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=721+North+Morley+Street+Moberly+MO+65270" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-6 inline-block btn-primary"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-ink text-white py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-serif font-bold tracking-tighter mb-4">EL VAQUERO</h2>
          <p className="text-white/50 max-w-xs">Authentic Mexican flavor, bold experiences, and family-friendly dining in Moberly.</p>
        </div>

        <div className="flex gap-6">
          <a href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary-orange hover:border-primary-orange transition-all">
            <Facebook size={20} />
          </a>
          <a href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary-orange hover:border-primary-orange transition-all">
            <Instagram size={20} />
          </a>
        </div>

        <div className="text-center md:text-right text-white/50 text-sm">
          <p>© {new Date().getFullYear()} El Vaquero Mexican Restaurant.</p>
          <p className="mt-2">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedDishes />
      <Menu />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
