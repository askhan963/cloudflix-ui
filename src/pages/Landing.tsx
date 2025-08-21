import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % mockVideos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-neutral text-primary overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-secondary/5 to-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-dark bg-white/90 backdrop-blur-sm px-4 py-2 text-sm shadow-lg">
              <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="font-medium">Live • Fast • Interactive</span>
            </div>

            <h1 className="mt-6 text-6xl lg:text-7xl font-black tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Watch.
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
                Rate.
              </span>
              <br />
              <span className="text-primary">
                Create.
              </span>
            </h1>

            <p className="mt-6 text-xl lg:text-2xl text-primary/80 leading-relaxed max-w-lg">
              The next-gen video platform built for creators and viewers. 
              <span className="text-secondary font-semibold"> Lightning fast</span>, 
              <span className="text-accent font-semibold"> beautifully designed</span>, 
              and <span className="font-semibold">completely free</span>.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/feed"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-secondary to-accent px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10">🚀 Explore Videos</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/signup"
                className="group rounded-2xl border-2 border-primary px-8 py-4 text-lg font-semibold transition-all hover:bg-primary hover:text-white hover:scale-105"
              >
                ✨ Join CloudFlix
              </Link>
            </div>

            <div className="mt-4">
              <Link 
                to="/upload" 
                className="inline-flex items-center gap-2 text-primary/70 hover:text-secondary transition-colors group"
              >
                <span>Creator?</span>
                <span className="underline decoration-accent underline-offset-4 group-hover:decoration-secondary">
                  Upload your first video →
                </span>
              </Link>
            </div>

            {/* Enhanced Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { value: "0.1s", label: "Load Time", icon: "⚡" },
                { value: "100%", label: "Type Safe", icon: "🛡️" },
                { value: "∞", label: "Scalable", icon: "🚀" }
              ].map((stat, i) => (
                <div 
                  key={stat.value} 
                  className={`group relative overflow-hidden rounded-2xl border border-neutral-dark bg-white/80 backdrop-blur-sm p-4 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105 delay-${i * 100}`}
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-secondary">{stat.value}</div>
                  <div className="text-xs text-primary/60 font-medium">{stat.label}</div>
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Interactive Preview */}
          <div className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative">
              {/* Main Preview Card */}
              <div className="relative aspect-[9/16] max-w-sm mx-auto rounded-3xl border-4 border-white bg-gradient-to-br from-white via-neutral to-white shadow-2xl overflow-hidden">
                {/* Phone-like Header */}
                <div className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm border-b border-neutral-dark/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                      <span className="text-white font-bold text-sm">CF</span>
                    </div>
                    <span className="font-semibold text-sm">CloudFlix</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-accent"></div>
                    <div className="w-1 h-1 rounded-full bg-secondary"></div>
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                  </div>
                </div>

                {/* Video Preview */}
                <div className="relative bg-gradient-to-br from-neutral-dark/5 to-secondary/5 aspect-square">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-sm">{mockVideos[currentVideoIndex].title}</h3>
                        <div className="flex items-center justify-center gap-4 text-xs text-primary/60">
                          <span>👁️ {mockVideos[currentVideoIndex].views}</span>
                          <span>⭐ {mockVideos[currentVideoIndex].rating}</span>
                          <span>💬 {mockVideos[currentVideoIndex].comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-center gap-4">
                    <button className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary/20 transition-colors">
                      ❤️
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent hover:bg-accent/20 transition-colors">
                      💬
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                      📤
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-secondary shadow-lg flex items-center justify-center animate-bounce">
                <span className="text-white text-xl">🔥</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary shadow-lg flex items-center justify-center animate-pulse">
                <span className="text-white">⚡</span>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary/20 via-accent/20 to-primary/20 blur-3xl scale-110" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-secondary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-gradient-to-br from-white via-neutral to-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Why CloudFlix?
              </span>
            </h2>
            <p className="text-xl text-primary/70 max-w-2xl mx-auto">
              Built for speed, designed for creators, loved by viewers. Experience the future of video sharing.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className={`group relative overflow-hidden rounded-3xl border border-neutral-dark/20 bg-white/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <div className="text-white text-xl">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-primary/70 mb-4 leading-relaxed">{feature.desc}</p>
                  <span className="inline-block rounded-xl bg-gradient-to-r from-secondary/10 to-accent/10 px-4 py-2 text-sm font-medium text-secondary border border-secondary/20">
                    {feature.tag}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS SECTION */}
      <section className="py-20 bg-gradient-to-br from-neutral via-white to-neutral">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Get started in <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">3 simple steps</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: 1,
                title: "Create Account",
                desc: "Join as creator or viewer in seconds",
                cta: { to: "/signup", label: "Sign Up", icon: "🚀" },
                color: "from-secondary to-accent"
              },
              {
                step: 2,
                title: "Explore Feed",
                desc: "Discover amazing content instantly",
                cta: { to: "/feed", label: "Browse", icon: "🎬" },
                color: "from-accent to-primary"
              },
              {
                step: 3,
                title: "Upload & Share",
                desc: "Share your creativity with the world",
                cta: { to: "/upload", label: "Create", icon: "✨" },
                color: "from-primary to-secondary"
              }
            ].map((step, index) => (
              <div
                key={step.step}
                className="group relative overflow-hidden rounded-3xl bg-white border border-neutral-dark/20 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-white text-2xl font-bold">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-primary/70 mb-6 leading-relaxed">{step.desc}</p>
                  <Link
                    to={step.cta.to}
                    className={`inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r ${step.color} px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105`}
                  >
                    <span>{step.cta.icon}</span>
                    {step.cta.label}
                  </Link>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ.map((item, index) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-neutral-dark/20 bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <summary className="cursor-pointer list-none font-semibold text-lg flex justify-between items-center">
                  <span>{item.q}</span>
                  <span className="text-2xl text-secondary group-open:rotate-45 transition-transform">＋</span>
                </summary>
                <p className="mt-4 text-primary/70 leading-relaxed pl-2 border-l-4 border-accent/30">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-secondary via-accent to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 mx-auto max-w-4xl text-center px-4">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Ready to Create?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators and viewers on the fastest-growing video platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="rounded-2xl bg-white text-primary px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              🚀 Start Creating Today
            </Link>
            <Link
              to="/feed"
              className="rounded-2xl border-2 border-white text-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-primary transition-all hover:scale-105"
            >
              🎬 Explore Videos
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-dark bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <span className="text-white font-bold">CF</span>
              </div>
              <div>
                <div className="font-bold text-lg">CloudFlix</div>
                <div className="text-xs text-primary/60">© {new Date().getFullYear()} All rights reserved</div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <Link to="/feed" className="text-primary/70 hover:text-secondary transition-colors font-medium">
                Feed
              </Link>
              <Link to="/me" className="text-primary/70 hover:text-secondary transition-colors font-medium">
                Profile
              </Link>
              <Link to="/upload" className="rounded-xl bg-gradient-to-r from-accent to-secondary px-4 py-2 text-white font-semibold hover:shadow-lg transition-all hover:scale-105">
                Upload
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Data ---------- */

const mockVideos = [
  { title: "Amazing Sunset", views: "12K", rating: "4.8", comments: "89" },
  { title: "City Life", views: "8.5K", rating: "4.6", comments: "142" },
  { title: "Nature Walk", views: "15K", rating: "4.9", comments: "203" }
];

const FEATURES = [
  {
    title: "Lightning Fast",
    desc: "React Query with optimized caching keeps your content loading in milliseconds, not seconds.",
    tag: "Performance",
    icon: "⚡",
  },
  {
    title: "Secure & Reliable",
    desc: "JWT authentication with auto-refresh ensures your account stays safe and accessible.",
    tag: "Security",
    icon: "🛡️",
  },
  {
    title: "Creator-First",
    desc: "Seamless upload experience with real-time progress and instant video processing.",
    tag: "Upload",
    icon: "🎬",
  },
  {
    title: "Smart Ratings",
    desc: "Advanced rating system with half-star precision and optimistic UI updates.",
    tag: "Engagement",
    icon: "⭐",
  },
  {
    title: "Real-time Chat",
    desc: "Instant comments with smart moderation and creator controls for healthy discussions.",
    tag: "Community",
    icon: "💬",
  },
  {
    title: "Zero Bloat",
    desc: "Pure performance with Tailwind CSS and minimal dependencies for blazing speed.",
    tag: "Minimal",
    icon: "🚀",
  },
];

const FAQ = [
  {
    q: "What makes CloudFlix different?",
    a: "CloudFlix combines the speed of modern web tech (React + TypeScript + Vite) with a creator-first approach. No bloated features, just fast, reliable video sharing with smart ratings and real-time engagement.",
  },
  {
    q: "How do I become a creator?",
    a: "Simply sign up and select 'Creator' during registration. You'll instantly get access to upload videos, track analytics, and engage with your audience through our creator dashboard.",
  },
  {
    q: "Is CloudFlix really free?",
    a: "Yes! CloudFlix is completely free for both creators and viewers. We believe great content should be accessible to everyone, without subscription barriers or hidden fees.",
  },
  {
    q: "What video formats do you support?",
    a: "Currently, we support MP4 uploads with automatic optimization for web playback. We're working on supporting more formats including WebM and MOV in future updates.",
  },
  {
    q: "How does the rating system work?",
    a: "Our 5-star rating system supports half-star increments for precise feedback. Ratings are processed server-side with spam protection, while the UI updates optimistically for instant feedback.",
  },
  {
    q: "Can I delete my content?",
    a: "Absolutely! Creators have full control over their content. You can edit, delete, or update your videos anytime from your creator dashboard. We also provide analytics to help you understand your audience better.",
  },
];