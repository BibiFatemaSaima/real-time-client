const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-base-200">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Real-Time Collaborative Platform
          </h1>

          <p className="text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto mb-8">
            Collaborate, communicate, and work together in real time from
            anywhere.
          </p>

          <div className="flex justify-center gap-4">
            <button className="btn btn-primary">Get Started</button>

            <button className="btn btn-outline">Learn More</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">
                  Real-Time Collaboration
                </h3>
                <p>Work together with your team in real time.</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">
                  Easy Communication
                </h3>
                <p>Stay connected and communicate with your team easily.</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Secure & Reliable</h3>
                <p>Keep your work and information safe and organized.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
