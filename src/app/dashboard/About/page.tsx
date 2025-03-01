import React from 'react';

const About = () => {
  return (
    <div>
      {/* About Section */}
      <section className="container mx-auto py-16 px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800">About CircleU</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          CircleU is a dynamic platform designed to foster collaboration, creativity, and connection among college students. Our goal is to create a space where students can easily find and collaborate with peers, join events, and access tools that streamline their academic and social experiences. Whether you're a student looking for a hackathon team, a flatmate, or a community to share ideas with, CircleU is here to help you thrive.
        </p>
      </section>

      {/* Vision Section */}
      <section className="container mx-auto py-16 px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800">Our Vision</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          We envision CircleU as the go-to platform for student collaboration and engagement. By continuously enhancing our platform with AI-driven features and user-centric tools, we hope to make student life more connected, organized, and enjoyable.
        </p>
      </section>

      {/* Why CircleU Section */}
      <section className="container mx-auto py-16 px-6">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-800">Why CircleU?</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-gray-800">Seamless Collaboration</h4>
            <p className="text-gray-600 mt-2">
              Form and join hackathon teams, project groups, and other student communities effortlessly.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-gray-800">Efficient Event Management</h4>
            <p className="text-gray-600 mt-2">
              Organize and manage events with ease, from planning to feedback collection.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-gray-800">Easy Communication</h4>
            <p className="text-gray-600 mt-2">
              Stay connected with your peers through messaging, announcements, and group discussions.
            </p>
          </div>
        </div>
      </section>

     
    </div>
  );
}

export default About;
