const Footer = () => {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content p-10">
      <aside>
        <h2 className="text-2xl font-bold">Real-Time Collaborative</h2>

        <p>Collaborate, manage tasks, and work together in real time.</p>

        <p>
          © {new Date().getFullYear()} Real-Time Collaborative. All rights
          reserved.
        </p>
      </aside>

      <nav>
        <div className="grid grid-flow-col gap-4">
          <a href="#" className="link link-hover">
            Facebook
          </a>

          <a href="#" className="link link-hover">
            GitHub
          </a>

          <a href="#" className="link link-hover">
            LinkedIn
          </a>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
