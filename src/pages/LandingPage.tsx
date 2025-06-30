import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Target, Award, Bell, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 md:py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
                Transform Your Life with Daily Motivation
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of people who are changing their lives through personalized challenges, daily inspiration, and proven growth strategies.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link to="/home" className="btn-primary">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/signup" className="btn-primary">
                      Get Started Free
                    </Link>
                    <Link to="/signin" className="btn bg-white/10 text-white hover:bg-white/20">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute -top-8 -right-8 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl"></div>
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="People collaborating" 
                className="rounded-2xl shadow-2xl relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything You Need to Succeed
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Sparkles className="w-8 h-8 text-purple-500" />}
              title="Daily Inspiration"
              description="Start each day with curated motivational quotes tailored to your goals."
            />
            <FeatureCard 
              icon={<Target className="w-8 h-8 text-blue-500" />}
              title="30-Day Challenges"
              description="Join structured challenges in health, relationships, coding, and more."
            />
            <FeatureCard 
              icon={<Bell className="w-8 h-8 text-green-500" />}
              title="Smart Reminders"
              description="Get notifications at your preferred times to stay on track."
            />
            <FeatureCard 
              icon={<Award className="w-8 h-8 text-orange-500" />}
              title="Achievement Badges"
              description="Earn unique badges as you complete challenges and reach milestones."
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Choose Your Growth Path
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryCard
              title="Mental Wellness"
              description="Overcome challenges and build resilience with guided practices."
              image="https://images.pexels.com/photos/3759658/pexels-photo-3759658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              color="from-blue-500 to-purple-500"
            />
            <CategoryCard
              title="Physical Health"
              description="Transform your body with daily fitness and nutrition challenges."
              image="https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              color="from-green-500 to-teal-500"
            />
            <CategoryCard
              title="Coding Skills"
              description="Level up your programming skills with daily coding exercises."
              image="https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              color="from-purple-500 to-pink-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of motivated individuals and start transforming your life today.
          </p>
          {!user && (
            <Link 
              to="/signup" 
              className="btn-primary bg-white text-blue-600 hover:bg-blue-50 inline-flex items-center"
            >
              Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  color: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, image, color }) => (
  <div className="group relative overflow-hidden rounded-xl shadow-lg">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/75 z-10"></div>
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-75 transition-opacity duration-300 z-20`}></div>
    <img src={image} alt={title} className="w-full h-64 object-cover" />
    <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-30">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/90">{description}</p>
    </div>
  </div>
);

export default LandingPage;