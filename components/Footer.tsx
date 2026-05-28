import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#174933] text-white pt-20 pb-10 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-black mb-6 tracking-tighter">
              Knoveryx<span className="text-[#ff6a97]">.</span>
            </h2>
            <p className="text-[#ffffffaf] text-sm leading-relaxed mb-6">
              An interdisciplinary digital learning platform empowering learners through 
              accessible, example-rich instruction and inclusive pedagogy.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#ff6a97] transition-colors"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#ff6a97] transition-colors"><Twitter size={18} /></a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#ff6a97] transition-colors"><Instagram size={18} /></a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#ff6a97] transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Offerings Column */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Curriculum</h4>
            <ul className="space-y-4 text-[#ffffffaf] text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">Academic Support (IGCSE/IB)</li>
              <li className="hover:text-white transition-colors cursor-pointer">International Test Prep</li>
              <li className="hover:text-white transition-colors cursor-pointer">Teacher Training</li>
              <li className="hover:text-white transition-colors cursor-pointer">Digital Skills & AI</li>
              <li className="hover:text-white transition-colors cursor-pointer">Professional Development</li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Platform</h4>
            <ul className="space-y-4 text-[#ffffffaf] text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">Find a Tutor</li>
              <li className="hover:text-white transition-colors cursor-pointer">AI Companions</li>
              <li className="hover:text-white transition-colors cursor-pointer">How it Works</li>
              <li className="hover:text-white transition-colors cursor-pointer">Leadership Team</li>
              <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Global Presence</h4>
            <div className="space-y-4 text-[#ffffffaf] text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#ff6a97] shrink-0" />
                <span>Supporting learners in Oman, Pakistan, and beyond.</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#ff6a97] shrink-0" />
                <span>info@knoveryx.com</span>
              </div>
            </div>
            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-xs text-[#ffffffaf]">
                Co-founded by <span className="text-white font-medium">M. Tayyeb Akram</span> & <span className="text-white font-medium">Dr. Asmara Shafqat</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:row items-center justify-between gap-4 text-xs text-[#ffffffaf]">
          <p>© {new Date().getFullYear()} Knoveryx Education LLC. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;