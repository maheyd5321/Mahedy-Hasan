import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { X, Calendar, Clock, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

export const ScheduleViewingModal: React.FC = () => {
  const { selectedScheduleProperty, closeScheduleModal, submitViewingRequest } = useCms();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!selectedScheduleProperty) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !preferredDate) return;

    submitViewingRequest({
      name,
      email,
      phone,
      propertyId: selectedScheduleProperty.propertyId,
      propertyTitle: selectedScheduleProperty.title,
      preferredDate,
      preferredTime,
      message,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeScheduleModal();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-[#E5E7E8] overflow-hidden">
        {/* Header */}
        <div className="bg-[#0F2433] text-white p-6 relative">
          <button
            onClick={closeScheduleModal}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#C8A46B] uppercase mb-1">
            <Building className="w-4 h-4" />
            <span>Private Property Tour</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">Schedule a Private Viewing</h2>
          <p className="text-xs text-white/80 mt-1 line-clamp-1">
            {selectedScheduleProperty.title} · {selectedScheduleProperty.propertyId}
          </p>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#0F2433]">Viewing Requested</h3>
            <p className="text-sm text-[#283238]/80 leading-relaxed max-w-sm mx-auto">
              Thank you, <strong className="text-[#0F2433]">{name}</strong>. Our private client
              concierge has logged your request for{' '}
              <strong className="text-[#0F2433]">{preferredDate}</strong> at{' '}
              <strong className="text-[#0F2433]">{preferredTime}</strong> and will confirm shortly via
              phone or email.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8A46B]" />
              <span>Directly transmitted to PREMIER Wix CMS Viewing Registry</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F2433] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harrison Sterling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm border border-[#E5E7E8] rounded-md px-3 py-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2433] uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-sm border border-[#E5E7E8] rounded-md px-3 py-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2433] uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm border border-[#E5E7E8] rounded-md px-3 py-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F2433] uppercase tracking-wider mb-1">
                  Preferred Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full text-sm border border-[#E5E7E8] rounded-md px-3 py-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2433] uppercase tracking-wider mb-1">
                  Preferred Time *
                </label>
                <div className="relative">
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full text-sm border border-[#E5E7E8] rounded-md px-3 py-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B] bg-white"
                  >
                    <option value="09:00 AM">09:00 AM (Morning)</option>
                    <option value="11:00 AM">11:00 AM (Mid-Day)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="04:30 PM">04:30 PM (Golden Hour Sunset)</option>
                    <option value="06:00 PM">06:00 PM (Evening Tour)</option>
                  </select>
                  <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2433] uppercase tracking-wider mb-1">
                Special Requests / Confidentiality Notes
              </label>
              <textarea
                rows={2}
                placeholder="Specific architectural focus, NDA requirements, private parking access, etc."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-sm border border-[#E5E7E8] rounded-md px-3 py-2 text-[#0F2433] focus:outline-none focus:border-[#C8A46B]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeScheduleModal}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-[#0F2433] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0F2433] hover:bg-[#1E3A5F] text-white font-semibold text-xs tracking-wider uppercase rounded-md transition-colors cursor-pointer shadow"
              >
                Confirm Viewing Appointment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
