import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Send, GraduationCap, CheckCircle, AlertCircle, ArrowUpRight,
  Sparkles, BookOpen, Users, ShieldCheck
} from "lucide-react";
import api from "../services/api";

function InquiryForm() {
  const initialForm = {
    user_type: "", category: "", name: "", email: "", phone: "", message: "",
  };
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const response = await api.post("/api/inquiries", form);
      setSuccess(response.data.message);
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="hunar-public">
      <div className="hunar-public-shell">
        <section className="hunar-story-panel">
          <div className="hunar-brand">
            <span className="hunar-brand-mark"><GraduationCap size={25} /></span>
            <span>K12 <b>Hunar</b></span>
          </div>

          <div className="hunar-story-content">
            <span className="eyebrow"><Sparkles size={14} /> LEARNING STARTS WITH A CONVERSATION</span>
            <h1>Every learner has a story. <em>Let’s shape yours.</em></h1>
            <p className="hunar-story-copy">
              Connect with the K12 Hunar team for guidance on admissions,
              scholarships, events and learning opportunities.
            </p>

            <div className="hunar-benefits">
              <div><span className="benefit-icon"><BookOpen size={18} /></span><span><b>Guidance that matters</b><small>Get answers from our team.</small></span></div>
              <div><span className="benefit-icon"><Users size={18} /></span><span><b>For every learner</b><small>Parents, students and schools.</small></span></div>
              <div><span className="benefit-icon"><ShieldCheck size={18} /></span><span><b>Your details stay safe</b><small>We use your information to respond.</small></span></div>
            </div>
          </div>

          <div className="hunar-panel-bottom">
            <span>Curiosity opens doors.</span>
            <span className="orbit-art" aria-hidden="true"><i /><i /><i /></span>
            <small>© 2026 K12 Hunar</small>
          </div>
        </section>

        <section className="hunar-form-panel">
          <div className="hunar-form-top">
            <span className="form-step">LET’S GET STARTED</span>
            <Link to="/admin/login" className="admin-entry">Admin portal <ArrowUpRight size={15} /></Link>
          </div>

          <div className="hunar-form-heading">
            <span className="heading-spark">✳</span>
            <h2>Tell us what’s on your mind.</h2>
            <p>Fill in the details below. Our team will get back to you shortly.</p>
          </div>

          {success && <div className="hunar-alert success"><CheckCircle size={18} />{success}</div>}
          {error && <div className="hunar-alert error"><AlertCircle size={18} />{error}</div>}

          <form className="hunar-form" onSubmit={handleSubmit}>
            <div className="hunar-form-grid">
              <label className="hunar-field">
                <span>I am a <b>*</b></span>
                <select name="user_type" value={form.user_type} onChange={handleChange} required>
                  <option value="">Choose your role</option>
                  <option value="Parent">Parent</option>
                  <option value="Student">Student</option>
                  <option value="School">School</option>
                </select>
              </label>

              <label className="hunar-field">
                <span>I'm interested in <b>*</b></span>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Choose a topic</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Concert">Concert</option>
                  <option value="Admission">Admission</option>
                  <option value="General Query">General Query</option>
                </select>
              </label>

              <label className="hunar-field">
                <span>Full name <b>*</b></span>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ananya Sharma" maxLength={150} required />
              </label>

              <label className="hunar-field">
                <span>Email address <b>*</b></span>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" maxLength={255} required />
              </label>

              <label className="hunar-field full">
                <span>Phone number <b>*</b></span>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your contact number" maxLength={20} required />
              </label>

              <label className="hunar-field full">
                <span>Your message <b>*</b></span>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Share a little about what you need help with..." maxLength={5000} rows={4} required />
              </label>
            </div>

            <div className="hunar-submit-row">
              <span>Fields marked * are required</span>
              <button type="submit" className="hunar-submit" disabled={loading}>
                {loading ? "Sending..." : "Send inquiry"} <Send size={16} />
              </button>
            </div>
          </form>

          <div className="hunar-form-footer">
            <span>Thoughtful guidance. Meaningful opportunities.</span>
            <span>Made for learners <span className="tiny-heart">♥</span></span>
          </div>
        </section>
      </div>
    </main>
  );
}

export default InquiryForm;
