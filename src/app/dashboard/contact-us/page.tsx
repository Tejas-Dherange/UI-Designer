import React from 'react';

const ContactUs = () => {
  return (
    <div>
      {/* Contact Us Section */}
      <section className="container mx-auto py-16 px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800">Contact Us</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have questions, feedback, or just want to get in touch, we're here to help. Fill out the form below or use the contact details provided.
        </p>
        
        <form className="mt-8 max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
            <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" id="name" placeholder="Your Name" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" id="email" placeholder="Your Email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">Message</label>
            <textarea className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" id="message"  placeholder="Your Message"></textarea>
          </div>
          <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-600">Send Message</button>
        </form>
      </section>

      {/* Contact Details Section */}
      <section className="container mx-auto py-16 px-6 text-center">
        <h4 className="text-3xl font-bold text-gray-800 mt-8">Other Ways to Reach Us</h4>
        <p className="mt-2 text-gray-600">
          Email: <a href="mailto:support@circleu.com" className="text-blue-500">support@circleu.com</a>
        </p>
        <p className="text-gray-600">Phone: +91 8888 888888</p>
        
        <h4 className="text-3xl font-bold text-gray-800 mt-8">Social Media</h4>
        <p className="mt-2 text-gray-600">
          <a href="#" className="text-blue-500">Facebook</a> |
          <a href="#" className="text-blue-500">Twitter</a> |
          <a href="#" className="text-blue-500">Instagram</a>
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>&copy; 2025 CircleU. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ContactUs;
