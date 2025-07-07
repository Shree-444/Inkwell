import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenTool, Users, BookOpen, ArrowRight, Check, MoonIcon } from "lucide-react"
import { useNavigate } from "react-router"
import { Helmet } from "react-helmet"
import { ThemeToggleButton } from "@/components/ui/ThemeToggle"

export default function Landing() {
  
  const Navigate = useNavigate()

  const features = [
    {
      icon: PenTool,
      title: "AI assisted editor",
      description: "Write blogs that appeal to the readers with our AI powered editor designed for writers.",
    },
    {
      icon: Users,
      title: "Connect with Readers",
      description: "Build your audience and engage with a community of passionate readers and writers.",
    },
    {
      icon: BookOpen,
      title: "Discover Great Stories",
      description: "Explore curated content from talented writers across various topics and genres.",
    },
    {
      icon: MoonIcon,
      title: "Dark Mode Ready",
      description: "Write and read comfortably anytime with a sleek dark theme built for focus."
    },
  ]

  const benefits = [
    "Clean, minimalist interface",
    "AI assisted editor",
    "Dark mode available",
    "Responsive design",
    "Easy content management",
    "Cross browser compatibility",
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Inkwell - Minimalist Blogging for Writers</title>
        <meta name="description" content="Inkwell is your space to blog without the noise, designed for writers who value simplicity and style." />
      </Helmet>
      
      {/* Navigation */}
      <nav className="bg-chart-3 border-b border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row justify-between items-center py-4 space-y-4 sm:space-y-0">

            <div className="flex justify-center sm:justify-start w-full sm:w-auto items-center space-x-2 group cursor-default">
              <PenTool className="sm:h-6 sm:w-6 h-4 w-4 text-foreground transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="sm:text-3xl text-2xl font-semibold text-foreground transition-all duration-300 group-hover:tracking-wide">
                <i>inkwell.</i>
              </span>
            </div>

            <div className="flex justify-between w-full sm:w-auto items-center">

              <Button
                variant="outline"
                size="sm"
                
                className="border-border cursor-pointer px-0 text-foreground hover:bg-muted hover:text-foreground transition-all duration-300"
              >
                <ThemeToggleButton/>
              </Button>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => Navigate('/signin')}
                  className="text-muted-foreground cursor-pointer hover:text-foreground hover:bg-muted transition-all duration-300"
                >
                  Login
                </Button>
                <Button
                  onClick={() => Navigate('/signup')}
                  className="bg-primary cursor-pointer text-primary-foreground hover:bg-primary/80 transition-all duration-300"
                >
                  Get Started
                </Button>
              </div>

            </div>

          </div>
        </div>
      </nav>




      {/* Hero Section */}
      <section className="relative bg-chart-3 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-25 sm:py-28">
          <div className="text-center">
            <div className="mb-8 sm:mt-10 cursor-default">
              <h1 className="text-5xl md:text-7xl font-light text-muted-foreground sm:text-foreground mb-6 tracking-tight transition-all duration-700 hover:tracking-wide">
                Your stories deserve
                <br />
                <span className="text-foreground sm:text-muted-foreground font-medium transition-all duration-500 hover:text-foreground">
                  beautiful spaces
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-500 hover:text-foreground">
                Inkwell is your space to blog without the noise, designed for writers who value simplicity and style.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={() => Navigate('/signup')}
                className="bg-primary text-primary-foreground hover:bg-primary/80 px-8 py-3 text-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/30 group"
              >
                Start Writing Today
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground cursor-default transition-all duration-300 hover:text-foreground">
              Join thousands of writers sharing their stories • No credit card required
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-10 transform -translate-y-1/2 opacity-10 transition-all duration-700 hover:opacity-20 hover:scale-110">
          <div className="w-32 h-32 rounded-full bg-primary" />
        </div>
        <div className="absolute top-1/4 right-10 opacity-10 transition-all duration-700 hover:opacity-20 hover:scale-110">
          <div className="w-20 h-20 rounded-full bg-primary" />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-chart-4 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4 transition-all duration-500 hover:tracking-wide">
              Everything you need to share your voice
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-300 hover:text-foreground">
              Powerful features wrapped in a beautiful simple interface that gets out of your way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-card border-border hover:shadow-lg transition-all duration-500 hover:scale-105 hover:border-border group cursor-default"
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted mb-4 transition-all duration-300 group-hover:bg-muted/70 group-hover:scale-110 group-hover:rotate-3">
                    <feature.icon className="h-6 w-6 text-foreground transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2 transition-all duration-300 group-hover:text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed transition-all duration-300 group-hover:text-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-chart-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6 cursor-default transition-all duration-500 hover:tracking-wide">
                Why writers choose <i>inkwell</i>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 cursor-default leading-relaxed transition-all duration-300 hover:text-foreground">
                We've built inkwell with one goal in mind: to create the most beautiful and distraction-free writing experience possible. Every feature is designed to help you focus on what matters most—your words.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 group cursor-default transition-all duration-300 hover:translate-x-2"
                  >
                    <Check className="h-5 w-5 text-primary flex-shrink-0 transition-all duration-300 group-hover:scale-110" />
                    <span className="text-sm text-muted-foreground transition-all duration-300 group-hover:text-foreground">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="bg-card border-border p-8 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-border">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 group animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-foreground transition-all duration-300 group-hover:scale-110" />
                    <div>
                      <div className="h-3 bg-primary rounded w-24 mb-1" />
                      <div className="h-2 bg-muted-foreground rounded w-16" />
                    </div>
                  </div>
                  <div className="space-y-2 animate-pulse">
                    <div className="h-3 bg-muted-foreground rounded w-full" />
                    <div className="h-3 bg-muted-foreground rounded w-5/6" />
                    <div className="h-3 bg-muted-foreground rounded w-4/6" />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Badge variant="secondary" className="bg-muted text-foreground border-border text-xs">
                      Design
                    </Badge>
                    <Badge variant="secondary" className="bg-muted text-foreground border-border text-xs">
                      Writing
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-chart-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light cursor-default text-foreground mb-6 transition-all duration-500 hover:tracking-wide">
            Ready to start your writing journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 cursor-default max-w-2xl mx-auto transition-all duration-300 hover:text-foreground">
            Join thousands of writers who have already discovered the joy of writing on Inkwell. Your first story is just a click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => Navigate('/signup')}
              className="bg-primary cursor-pointer text-primary-foreground hover:bg-primary/80 transition-all duration-300"
            >
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => Navigate('/signin')}
              className="border-border cursor-pointer text-foreground hover:bg-muted transition-all duration-300"
            >
              Login
            </Button>
          </div>

          <p className="text-sm cursor-default transition-all duration-300 hover:text-foreground text-muted-foreground mt-6">
            Free to start • No spam, ever • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-chart-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center sm:mb-0 mb-2 space-x-2 group cursor-pointer">
              <PenTool className="h-5 w-5 text-foreground transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="text-lg font-medium text-foreground">
                <i>inkwell.</i>
              </span>
            </div>
            <div className="flex items-center space-x-8">
              <p className="text-sm text-muted-foreground hover:text-foreground">About</p>
              <p className="text-sm text-muted-foreground hover:text-foreground">Privacy</p>
              <p className="text-sm text-muted-foreground hover:text-foreground">Terms</p>
              <p className="text-sm text-muted-foreground hover:text-foreground">Support</p>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center ">
            <p className="text-sm text-muted-foreground transition-all duration-300 hover:text-foreground">
              © 2025 inkwell. Made with ❤️ by Shreeyash, for writers everywhere.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
