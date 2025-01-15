// import React, { Profiler, useState } from 'react';
// import { Leaf, ShoppingBag, Droplets, Brain, LogIn, Menu, X } from 'lucide-react';
// import grdcirclelogo from "../src/assets/logos/grdlogo.png";
// import grdfulllogo from "../src/assets/logos/grdfulllogo.png";
// import { Link } from 'react-router-dom';
// import { useMyContext } from './utils/MyContext.jsx';
// // import {jwtDecode} from "jwt-decode";

// // Create a simple Profile component
// function Profile() {
//   return (
//     <div className="flex items-center">
//       <span className="text-gray-700">Profile</span>
//       {/* You can add user-specific data here */}
//     </div>
//   );
// }

// function App() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { user } = useMyContext();

//   // const token = localStorage.getItem('token');
//   // if(token){
//     // const decoded = jwtDecode(token);

//   //   // You can now access the token payload, for example:
//     // console.log("decoded is",decoded);

//   //   const expiryTime = decoded.exp * 1000; // exp is in seconds, multiply by 1000 to get milliseconds

//   //   if (expiryTime < Date.now()) {
//   //     console.log('Token has expired');
//   //   } else {
//   //     console.log('Token is valid');
//   //   }
//   // } 
  

//   // console.log("user in context: ", user);

//   return (
//     <div className="flex flex-col w-full min-h-screen">
//       {/* Navbar */}
//       <nav className="fixed top-0 left-0 right-0 z-50 bg-green-800 shadow-md ">
//         <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center">
//               <img src={grdcirclelogo} alt="GRD Naturals" className="w-auto h-12" />
//             </div>
            
//             {/* Desktop Navigation */}
//             <div className="hidden space-x-8 md:flex">
//               <NavLink active><Leaf className="w-4 h-4 mr-1" />Home</NavLink>
//               <Link to="/shop">
//                 <NavLink><ShoppingBag className="w-4 h-4 mr-1" />Shop</NavLink>
//               </Link>
//               <Link to="/blobs">
//                 <NavLink><Droplets className="w-4 h-4 mr-1" />Blobs</NavLink>
//               </Link>
              
//               <NavLink><Brain className="w-4 h-4 mr-1" />AI</NavLink>
//               {user ? (
//                 <Link to="/profile">
//                   <NavLink><Profile className="w-4 h-4 mr-1" /></NavLink> 
//                 </Link>
//                  // Show Profile if logged in
//               ) : (
//                 <Link to="/login">
//                   <NavLink><LogIn className="w-4 h-4 mr-1" />Login</NavLink>
//                 </Link>
//               )}
//             </div>

//             {/* Mobile menu button */}
//             <div className="md:hidden">
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="text-gray-700 hover:text-green-700 focus:outline-none"
//               >
//                 {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//               <MobileNavLink active><Leaf className="w-4 h-4 mr-2" />Home</MobileNavLink>
//               <Link to="/shop">
//                 <MobileNavLink><ShoppingBag className="w-4 h-4 mr-2" />Shop</MobileNavLink>
//               </Link>
//               <Link to="/blobs">
//                 <MobileNavLink><Droplets className="w-4 h-4 mr-2" />Blobs</MobileNavLink>
//               </Link>
//               <MobileNavLink><Brain className="w-4 h-4 mr-2" />AI</MobileNavLink>
//               {user ? (
//                 <Link to="/profile" >
//                   <MobileNavLink><Profile className="w-4 h-4 mr-2"  /></MobileNavLink> 
//                 </Link>
//                  // Show Profile in mobile nav
//               ) : (
//                 <Link to="/login">
//                   <MobileNavLink><LogIn className="w-4 h-4 mr-2" />Login</MobileNavLink>
//                 </Link>
//               )}
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Hero Section */}
//       <main className="flex-grow mt-10">
//         <div className="relative overflow-hidden bg-white">
//           <div className="mx-auto max-w-7xl">
//             <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
//               <div className="px-4 mx-auto mt-10 max-w-7xl sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
//                 <div className="text-center ">
//                   <img 
//                     src={grdfulllogo} 
//                     alt="GRD Naturals Full Logo" 
//                     className="w-full max-w-md mx-auto mb-8"
//                   />
//                   <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
//                     <span className="block text-green-700">Nature's Finest</span>
//                     <span className="block text-orange-500">Products for You</span>
//                   </h1>
//                   <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
//                     Discover our range of premium natural products, sourced from the purest ingredients 
//                     and crafted with care. From essential oils to organic supplements, we bring nature's 
//                     goodness directly to you.
//                   </p>
//                   <div className="mt-5 sm:mt-8 sm:flex sm:justify-center ">
//                     <div className="rounded-md shadow">
//                       <a
//                         href="#"
//                         className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-green-700 border border-transparent rounded-md hover:bg-green-800 md:py-4 md:text-lg md:px-10"
//                       >
//                         Shop Now
//                       </a>
//                     </div>
//                     <div className="mt-3 sm:mt-0 sm:ml-3">
//                       <a
//                         href="#"
//                         className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-green-700 bg-green-100 border border-transparent rounded-md hover:bg-green-200 md:py-4 md:text-lg md:px-10"
//                       >
//                         Learn More
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="text-white bg-green-800">
//         <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//             <div>
//               <h3 className="mb-4 text-lg font-semibold">About GRD Naturals</h3>
//               <p className="text-green-100">
//                 Committed to bringing you the finest natural products, 
//                 sourced responsibly and crafted with care.
//               </p>
//             </div>
//             <div>
//               <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-green-100 hover:text-white">About Us</a></li>
//                 <li><a href="#" className="text-green-100 hover:text-white">Products</a></li>
//                 <li><a href="#" className="text-green-100 hover:text-white">Contact</a></li>
//                 <li><a href="#" className="text-green-100 hover:text-white">Blog</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
//               <ul className="space-y-2 text-green-100">
//                 <li>Email: info@grdnaturals.com</li>
//                 <li>Phone: (555) 123-4567</li>
//                 <li>Address: 123 Nature Way, Green City</li>
//               </ul>
//             </div>
//           </div>
//           <div className="pt-8 mt-8 text-center text-green-100 border-t border-green-700">
//             <p>&copy; {new Date().getFullYear()} GRD Naturals. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// // Navigation Components
// const NavLink = ({ children, active = false }) => (
//   <div
//     className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
//       active
//         ? 'text-green-700 bg-green-50'
//         : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
//     }`}
//   >
//     {children}
//   </div>
// );

// const MobileNavLink = ({ children, active = false }) => (
//   <div
//     className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
//       active
//         ? 'text-green-700 bg-green-50'
//         : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
//     }`}
//   >
//     {children}
//   </div>
// );

// export default App;


import React, { useState } from 'react';
import { Leaf, ShoppingBag, Droplets, Brain, LogIn, Menu, X } from 'lucide-react';
import grdcirclelogo from "../src/assets/logos/grdlogo.png";
import grdfulllogo from "../src/assets/logos/grdfulllogo.png";
import { Link } from 'react-router-dom';
import { useMyContext } from './utils/MyContext.jsx';

function Profile() {
  return (
    <div className="flex items-center">
      <span className="text-gray-700">Profile</span>
    </div>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useMyContext();

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-green-700 shadow-md">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          <div className="flex items-center p-2 bg-green-50" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
            <img src={grdcirclelogo} alt="GRD Naturals" className="w-auto h-12" />
          </div>


            {/* Desktop Navigation */}
            <div className="hidden space-x-8 md:flex">
              <NavLink active><Leaf className="w-4 h-4 mr-1" />Home</NavLink>
              <Link to="/shop">
                <NavLink><ShoppingBag className="w-4 h-4 mr-1" />Shop</NavLink>
              </Link>
              <Link to="/blobs">
                <NavLink><Droplets className="w-4 h-4 mr-1" />Blobs</NavLink>
              </Link>
              <NavLink><Brain className="w-4 h-4 mr-1" />AI</NavLink>
              {user ? (
                <Link to="/profile">
                  <NavLink><Profile className="w-4 h-4 mr-1" /></NavLink>
                </Link>
              ) : (
                <Link to="/login">
                  <NavLink><LogIn className="w-4 h-4 mr-1" />Login</NavLink>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink active><Leaf className="w-4 h-4 mr-2" />Home</MobileNavLink>
              <Link to="/shop">
                <MobileNavLink><ShoppingBag className="w-4 h-4 mr-2" />Shop</MobileNavLink>
              </Link>
              <Link to="/blobs">
                <MobileNavLink><Droplets className="w-4 h-4 mr-2" />Blobs</MobileNavLink>
              </Link>
              <MobileNavLink><Brain className="w-4 h-4 mr-2" />AI</MobileNavLink>
              {user ? (
                <Link to="/profile">
                  <MobileNavLink><Profile className="w-4 h-4 mr-2" /></MobileNavLink>
                </Link>
              ) : (
                <Link to="/login">
                  <MobileNavLink><LogIn className="w-4 h-4 mr-2" />Login</MobileNavLink>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="flex-grow mt-10">
        <div className="relative overflow-hidden bg-green-50">
          <div className="mx-auto max-w-7xl">
            <div className="relative z-10 pb-8 bg-green-50 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
              <div className="px-4 mx-auto mt-10 max-w-7xl sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="text-center">
                  <img
                    src={grdfulllogo}
                    alt="GRD Naturals Full Logo"
                    className="w-full max-w-md mx-auto mb-8"
                  />
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block text-green-700">Nature's Finest</span>
                    <span className="block text-orange-500">Products for You</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                    Discover our range of premium natural products, sourced from the purest ingredients
                    and crafted with care. From essential oils to organic supplements, we bring nature's
                    goodness directly to you.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center ">
                    <div className="rounded-md shadow">
                      <Link
                        to="/shop"
                        className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-green-700 border border-transparent rounded-md hover:bg-green-800 md:py-4 md:text-lg md:px-10"
                      >
                        Shop Now
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <a
                        href="#"
                        className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-green-700 bg-green-100 border border-transparent rounded-md hover:bg-green-200 md:py-4 md:text-lg md:px-10"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-white bg-green-800">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold">About GRD Naturals</h3>
              <p className="text-green-100">
                Committed to bringing you the finest natural products,
                sourced responsibly and crafted with care.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-green-100 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-green-100 hover:text-white">Products</a></li>
                <li><a href="#" className="text-green-100 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-green-100 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
              <ul className="space-y-2 text-green-100">
                <li>Email: info@grdnaturals.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: 123 Nature Way, Green City</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 text-center text-green-100 border-t border-green-700">
            <p>&copy; {new Date().getFullYear()} GRD Naturals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Navigation Components
const NavLink = ({ children, active = false }) => (
  <div
    className={`flex items-center px-3 py-2 rounded-md transition duration-100 text-sm font-medium ${
      active
        ? 'text-green-700 bg-green-50'
        : 'text-white hover:text-green-700 hover:bg-green-50'
    }`}
  >
    {children}
  </div>
);

const MobileNavLink = ({ children, active = false }) => (
  <div
    className={`flex items-center px-3 py-2 rounded-md transition duration-100  text-base font-medium ${
      active
        ? 'text-green-700 bg-green-50'
        : 'text-white hover:text-green-700 hover:bg-green-50'
    }`}
  >
    {children}
  </div>
);

export default App;
