import { Scale, Heart, Shield, Users, Globe, BookOpen, Award, MessageSquare, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-800 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering Justice</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Breaking barriers to legal access with technology, empathy, and expertise
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-3 mb-6 rounded-full bg-purple-100">
              <Scale className="w-8 h-8 text-purple-700" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Our Mission & Vision</h2>
            <p className="text-lg text-gray-700 mb-8">
              At DIA, we believe that <span className="font-semibold">justice is a fundamental right, not a privilege</span>. 
              Our vision is a world where every individual, regardless of gender, caste, or economic status, has equal access 
              to legal protection and support.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-700 mb-6">
                DIA was born from a stark reality: in 2022 alone, India recorded over 445,000 crimes against women, 
                with an estimated 77% of cases going unreported. The barriers to justice—be it financial constraints, 
                social stigma, or bureaucratic hurdles—are immense, particularly for women and marginalized communities.
              </p>
              <p className="text-gray-700">
                We recognized that technology could bridge this justice gap. What started as a vision to make legal aid 
                accessible has grown into a movement that's transforming lives across the country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What We Do</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8 text-purple-700" />,
                title: "AI-Powered Case Matching",
                description: "Connecting you with the perfect legal expert for your specific needs"
              },
              {
                icon: <Scale className="w-8 h-8 text-purple-700" />,
                title: "Sliding-Scale Fees",
                description: "Legal services priced fairly based on your financial situation"
              },
              {
                icon: <Shield className="w-8 h-8 text-purple-700" />,
                title: "SOS Emergency Support",
                description: "Immediate help when you need it most, available 24/7"
              },
              {
                icon: <Users className="w-8 h-8 text-purple-700" />,
                title: "Community Mentorship",
                description: "Peer support and guidance from those who understand your journey"
              },
              {
                icon: <Globe className="w-8 h-8 text-purple-700" />,
                title: "Multilingual Support",
                description: "Legal consultations in multiple regional languages"
              },
              {
                icon: <BookOpen className="w-8 h-8 text-purple-700" />,
                title: "Secure Document Vault",
                description: "Safe, encrypted storage for all your legal documents"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Challenge & Our Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">The Justice Gap We're Addressing</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {[
                { 
                  number: "445,000+", 
                  label: "Crimes against women reported in India (2022)",
                  source: "National Crime Records Bureau"
                },
                { 
                  number: "77%", 
                  label: "Of gender-based violence cases go unreported",
                  source: "National Family Health Survey"
                },
                { 
                  number: "5 Crore+", 
                  label: "Cases pending in Indian courts",
                  source: "National Judicial Data Grid"
                },
                { 
                  number: "< 1%", 
                  label: "Of rural women can afford legal representation",
                  source: "UNDP India"
                }
              ].map((stat, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-4xl font-bold text-purple-700 mb-2">{stat.number}</p>
                  <p className="text-gray-700 mb-2">{stat.label}</p>
                  <p className="text-sm text-gray-500">Source: {stat.source}</p>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-semibold mb-8">Our Vision for Impact</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "👥",
                    title: "10,000+ Individuals",
                    description: "Aiming to provide legal support in our first 3 years of operation"
                  },
                  {
                    icon: "⚖️",
                    title: "5,000+ Legal Experts",
                    description: "Building a nationwide network of vetted legal professionals"
                  },
                  {
                    icon: "🌐",
                    title: "24/7 Support",
                    description: "Ensuring round-the-clock access to emergency legal assistance"
                  }
                ].map((goal, index) => (
                  <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-4">{goal.icon}</div>
                    <h4 className="text-xl font-semibold mb-2">{goal.title}</h4>
                    <p className="text-gray-600">{goal.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Our Team</h2>
            <p className="text-gray-700 mb-12">
              DIA brings together a diverse team of legal experts, technologists, and social workers united by a common 
              mission: to make justice accessible to all. Our team includes former public defenders, human rights advocates, 
              and technology innovators working together to create systemic change.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {/* Founder */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 overflow-hidden">
                  <img 
                    src="/images/soha.png" 
                    alt="Soha Nabi" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22128%22%20height%3D%22128%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22128%22%20height%3D%22128%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2248%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20fill%3D%229f7aea%22%3ESN%3C%2Ftext%3E%3C%2Fsvg%3E';
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Soha Nabi</h3>
                <p className="text-purple-600 font-medium mb-4">Founder & Lead Developer</p>
                <p className="text-gray-600">
Founder and changemaker behind DIA. Committed to creating empathetic, tech-driven solutions that empower individuals to seek help, understand their rights, and heal with dignity.                </p>
              </div>
              
              {/* Co-Founder */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 overflow-hidden">
                  <img 
                    src="/images/saba.png" 
                    alt="Saba Fatima" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22128%22%20height%3D%22128%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22128%22%20height%3D%22128%22%20fill%3D%22%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2248%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20fill%3D%22%23e11d8b%22%3ESF%3C%2Ftext%3E%3C%2Fsvg%3E';
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Saba Fatima</h3>
                <p className="text-purple-600 font-medium mb-4">Co-Founder</p>
                <p className="text-gray-600">
                  Dedicated to empowering women and marginalized communities through accessible legal support and advocacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support & Partnerships */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Supporters</h2>
            <p className="text-gray-700 mb-12 text-center">
              DIA's journey would not have been possible without the unwavering support of our mentors and institutions. 
              Their encouragement, infrastructure, and guidance empower us to create a platform that brings justice closer 
              to those who need it most.
            </p>
            
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-6 flex items-center text-black-700">
                <span className="mr-2"></span> Key Supporters
              </h3>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">Our Principal</h4>
                  <p className="text-gray-600">
                    Providing us with office space, infrastructure, and the resources needed to pilot and refine DIA.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">Mr. Manoj Kumar Badagharwala (Mentor)</h4>
                  <p className="text-gray-600">
                    Offering invaluable mentorship, vision, and strategic guidance that shape DIA's growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Awards & Recognition */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Awards & Recognition</h2>
            <div className="space-y-6">
              {[
                "Winner, Social Impact Award - Tech for Good Summit 2023",
                "Featured in Forbes 30 Under 30 - Social Impact",
                "Recipient of Google Impact Challenge Grant",
                "Recognized by NITI Aayog's Women Transforming India"
              ].map((award, index) => (
                <div key={index} className="flex items-start">
                  <Award className="w-5 h-5 text-purple-700 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">{award}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Voices of Change</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "I believe in DIA because it bridges the gap between people and justice with compassion and technology.",
                author: "Priya S., Domestic Violence Survivor"
              },
              {
                quote: "This is the kind of change we need—justice that is affordable, accessible, and fearless.",
                author: "Rahul K., Client"
              },
              {
                quote: "I see so many people give up on justice because of cost or fear. DIA is exactly the kind of platform that can restore faith in the legal system.",
                author: "Dr. Mehta, Pro Bono Attorney"
              },
              {
                quote: "I will support DIA because it gives ordinary people the courage to fight for their rights. That’s how real change begins.",
                author: "Anita R., NGO Partner"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <MessageSquare className="w-8 h-8 text-purple-200 mb-4" />
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <p className="text-gray-600 font-medium">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-800 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Movement for Justice</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Together, we can build a future where everyone has equal access to justice and legal protection.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/donate" 
              className="bg-white text-purple-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              Donate Now <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a 
              href="/volunteer" 
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              Volunteer <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a 
              href="/partner" 
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              Partner With Us <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
