import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

// ── EmailJS config ─────────────────────────────────────────────────────────
// 1. Sign up free at https://www.emailjs.com
// 2. Create a service (Gmail works) → copy Service ID below
// 3. Create an email template → copy Template ID below
//    Template variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
// 4. Copy your Public Key from Account → API Keys
const EMAILJS_SERVICE_ID  = 'service_0fp2qtj';
const EMAILJS_TEMPLATE_ID = 'template_rqqkwco';
const EMAILJS_PUBLIC_KEY  = 'Ih-cemtq35FiOPEaq';

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  formData.name,
          from_email: formData.email,
          subject:    formData.subject,
          message:    formData.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try emailing us directly at Rvibseals@gmail.com');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Page Header */}
      <section className="relative py-16 overflow-hidden" >
        <div className="absolute inset-0">
          <img src="/src/images/team-photo.jpg" alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,82,159,0.88) 0%, rgba(0,40,80,0.92) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs text-white/60 uppercase tracking-wider mb-2">RVIBS FC</div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">Get in Touch</h1>
            <p className="text-white/70 text-lg">We'd love to hear from you</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl font-black text-gray-900 mb-8">Our Socials</h2>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#00529F' }}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold mb-1">Address</h3>
                    <p className="text-gray-600">Seals Arena<br />Nakuru, Kenya</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#00529F' }}>
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold mb-1">Phone</h3>
                    <p className="text-gray-600">0715 111 101</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#00529F' }}>
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold mb-1">Email</h3>
                    <p className="text-gray-600">Rvibseals@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/p/RVIBS-FC-61558837341794/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-white"
                    style={{ backgroundColor: '#00529F' }}
                  >
                    <Facebook className="w-4 h-4" /> Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/rvib_seals/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-white"
                    style={{ backgroundColor: '#00529F' }}
                  >
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                  <a
                    href="https://www.youtube.com/@riftvalleyinstituteofbusin4338"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-white"
                    style={{ backgroundColor: '#00529F' }}
                  >
                    <Youtube className="w-4 h-4" /> YouTube
                  </a>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Office Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Monday - Friday</span>
                    <span className="text-gray-900 font-bold">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Saturday</span>
                    <span className="text-gray-900 font-bold">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sunday</span>
                    <span className="text-gray-900 font-bold">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <h2 className="text-3xl font-black text-gray-900 mb-8">Send us a Message</h2>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-gray-900 font-bold mb-2 text-sm">Name</label>
                    <input
                      type="text" id="name" name="name" value={formData.name}
                      onChange={handleChange} required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': '#00529F' } as React.CSSProperties}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-900 font-bold mb-2 text-sm">Email</label>
                    <input
                      type="email" id="email" name="email" value={formData.email}
                      onChange={handleChange} required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-gray-900 font-bold mb-2 text-sm">Subject</label>
                    <select
                      id="subject" name="subject" value={formData.subject}
                      onChange={handleChange} required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="tickets">Ticket Information</option>
                      <option value="membership">Membership</option>
                      <option value="media">Media Inquiry</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-900 font-bold mb-2 text-sm">Message</label>
                    <textarea
                      id="message" name="message" value={formData.message}
                      onChange={handleChange} required rows={6}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full px-8 py-4 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #00529F 0%, #003d7a 100%)' }}
                  >
                    <Send className="w-5 h-5" />
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
