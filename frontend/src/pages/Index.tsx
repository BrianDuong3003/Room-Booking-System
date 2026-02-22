import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterForm } from "@/components/auth/RegisterForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-campus-blue to-campus-indigo text-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Smart Campus Management System
                </h1>
                <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-lg">
                  Revolutionize your university experience with our integrated campus management solution. Seamlessly control classroom resources and enhance security.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/dashboard">
                    <Button size="lg" variant="outline" className="bg-white text-campus-blue hover:bg-opacity-90 hover:text-white">
                      Access Dashboard
                    </Button>
                  </Link>
                  <Link to="#">
                    <Button size="lg" variant="outline" className="bg-white text-campus-blue hover:bg-opacity-90 hover:text-white">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="lg:w-1/2 bg-white rounded-lg shadow-xl p-6">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <LoginForm />
                  </TabsContent>
                  <TabsContent value="register">
                    <RegisterForm />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-campus-blue mb-4">
                Comprehensive Campus Management
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our smart campus system integrates classroom scheduling, security monitoring, and resource optimization in one powerful platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="w-12 h-12 bg-campus-accent rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <CardTitle>Classroom Management</CardTitle>
                  <CardDescription>Schedule and manage classroom resources efficiently</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-campus-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Room scheduling and booking
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-campus-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Automated resource control
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-campus-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Occupancy monitoring
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader>
                  <div className="w-12 h-12 bg-campus-accent rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <CardTitle>Security & Access Control</CardTitle>
                  <CardDescription>Keep your campus secure with smart monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-campus-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Role-based access control
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-campus-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Automated door controls
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-campus-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Emergency lockdown capabilities
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader>
                  <div className="w-12 h-12 bg-campus-accent rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <CardTitle>AI Integration</CardTitle>
                  <CardDescription>Leverage advanced AI for smart campus operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-campus-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Human detection technology
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-campus-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Automated electricity management
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-campus-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Usage analytics and reports
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* More Information */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-campus-blue rounded-lg overflow-hidden shadow-xl">
              <div className="md:flex">
                <div className="md:w-1/2 p-12 text-white">
                  <h2 className="text-3xl font-bold mb-6">Ready to transform your campus?</h2>
                  <p className="text-lg opacity-90 mb-8">
                    Join universities worldwide that are leveraging our smart campus technology to enhance security, improve resource management, and create a more efficient learning environment.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Reduce operational costs by up to 20%</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Enhance campus security with AI-powered monitoring</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Streamline administrative workflows</span>
                    </div>
                  </div>
                  <Link to="/contact">
                    <Button size="lg" className="bg-white text-campus-blue hover:bg-opacity-90">
                      Request a Demo
                    </Button>
                  </Link>
                </div>
                <div className="md:w-1/2 bg-campus-light p-12">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-2xl font-bold text-campus-blue mb-4">System Benefits</h3>
                    <ul className="space-y-4">
                      <li className="flex">
                        <div className="bg-campus-accent/10 rounded-full p-1 mr-4">
                          <svg className="h-5 w-5 text-campus-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">High Reliability</h4>
                          <p className="text-sm text-muted-foreground">Redundant systems with 99.9% uptime guarantee</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="bg-campus-accent/10 rounded-full p-1 mr-4">
                          <svg className="h-5 w-5 text-campus-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Quick Recovery</h4>
                          <p className="text-sm text-muted-foreground">Data recovery within 10 minutes of any incident</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="bg-campus-accent/10 rounded-full p-1 mr-4">
                          <svg className="h-5 w-5 text-campus-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Advanced Reporting</h4>
                          <p className="text-sm text-muted-foreground">Comprehensive analytics with automated email reports</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="bg-campus-accent/10 rounded-full p-1 mr-4">
                          <svg className="h-5 w-5 text-campus-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Enhanced Security</h4>
                          <p className="text-sm text-muted-foreground">Role-based access and encrypted credentials</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;