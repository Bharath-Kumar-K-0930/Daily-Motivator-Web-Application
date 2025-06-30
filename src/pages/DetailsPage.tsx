
import React from 'react';
import { ExternalLink, Youtube, Facebook, Linkedin, Github, Mail } from 'lucide-react';

const DetailsPage: React.FC = () => {
  return (
    <div className="container-custom py-8" style={{paddingTop : "70px" , maxWidth : "100%"}}>
      <h1 className="text-3xl font-bold mb-8">Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Navigation Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <ul className="space-y-2">
            <li>
              <Link text="Home" description="Your personalized dashboard" />
            </li>
            <li>
              <Link text="Explore" description="Discover new motivational content" />
            </li>
            <li>
              <Link text="Favorites" description="Your saved inspirational items" />
            </li>
            <li>
              <Link text="Goal Tracker" description="Monitor your progress" />
            </li>
          </ul>
        </div>

        {/* Categories Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            <li>
              <Link text="Success" description="Achieve your goals" />
            </li>
            <li>
              <Link text="Health" description="Maintain physical and mental wellness" />
            </li>
            <li>
              <Link text="Relationships" description="Build meaningful connections" />
            </li>
            <li>
              <Link text="Personal Growth" description="Continuous self-improvement" />
            </li>
          </ul>
        </div>

        {/* Legal Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Legal Information</h2>
          <ul className="space-y-2">
            <li>
              <Link 
                text="Privacy Policy" 
                description="Learn how we protect your data"
                external
              />
            </li>
            <li>
              <Link 
                text="Terms of Service" 
                description="Our service agreement"
                external
              />
            </li>
            <li>
              <Link 
                text="Cookie Policy" 
                description="How we use cookies"
                external
              />
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Contact & Support</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Need help? Our support team is here for you 24/7.
          </p>
          <a 
            href="mailto:dailymotivatorhelpdesk@gmail.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            dailymotivatorhelpdesk@gmail.com
          </a>
          <br/><br />
          <a href="/9999999999"
          className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            +91 9999999999
          </a>
        </div>
      </div>
        {/* Social Media Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" style={{maxWidth : "100%" , marginTop : "35px"}}>
          <h2 className="text-xl font-semibold mb-4">Social Media</h2>
          <div className="flex justify-center space-x-10">
            <a
              href="http://www.youtube.com/@Coding_With_Asur"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 transform hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-red-500 rounded-full p-2 flex items-center space-x-2"
              aria-label="YouTube"
            >
              <Youtube size={32} />
              <span className="font-semibold text-lg">YouTube</span>
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 transform hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-blue-500 rounded-full p-2 flex items-center space-x-2"
              aria-label="Facebook"
            >
              <Facebook size={32} />
              <span className="font-semibold text-lg">Facebook</span>
            </a>
            <a
              href="https://www.linkedin.com/in/bharath-kumar-k-b35ba0304/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 transform hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-blue-400 rounded-full p-2 flex items-center space-x-2"
              aria-label="LinkedIn"
            >
              <Linkedin size={32} />
              <span className="font-semibold text-lg">LinkedIn</span>
            </a>
            <a
              href="https://github.com/Bharath-Kumar-K-0930"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transform hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-gray-500 rounded-full p-2 flex items-center space-x-2"
              aria-label="GitHub"
            >
              <Github size={32} />
              <span className="font-semibold text-lg">GitHub</span>
            </a>
            <a
              href="mailto:dailymotivatorhelpdesk@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-600 transform hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-green-400 rounded-full p-2 flex items-center space-x-2"
              aria-label="Email"
            >
              <Mail size={32} />
              <span className="font-semibold text-lg">Mail</span>
            </a>
          </div>
        </div>

    </div>
  );
};

interface LinkProps {
  text: string;
  description: string;
  external?: boolean;
}

const Link: React.FC<LinkProps> = ({ text, description, external }) => (
  <div className="flex items-start">
    <div className="flex-grow">
      <h3 className="font-medium">{text}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
    {external && (
      <ExternalLink size={16} className="text-gray-400 dark:text-gray-500 mt-1 ml-2" />
    )}
  </div>
);

export default DetailsPage;
