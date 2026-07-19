import { Link } from "react-router-dom";
import { FaShieldAlt, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 w-fit">
              <span className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaShieldAlt className="text-white text-lg" />
              </span>
              <span className="text-[#1a1a2e] font-bold text-xl">
                Verify<span className="text-orange-500">Hire</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Safer job searching for everyone.
              <br />
              Verify employers, read reviews, report
              <br />
              scams.
            </p>
          </div>

          {/* Spacer col to push links right */}
          <div className="hidden sm:block sm:col-span-1" />

          {/* Explore */}
          <div>
            <h4 className="text-[#1a1a2e] font-bold text-sm mb-4">Explore</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/why" className="text-gray-500 text-sm hover:text-orange-500 transition-colors">
                  Why VerifyHire
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-500 text-sm hover:text-orange-500 transition-colors">
                  How it works?
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-500 text-sm hover:text-orange-500 transition-colors">
                  Log in
                </Link>
              </li>
            </ul>
          </div>

          {/* Company + Social stacked */}
          <div className="flex flex-col gap-6">
            {/* Company */}
            <div>
              <h4 className="text-[#1a1a2e] font-bold text-sm mb-3">Company</h4>
              <div className="flex flex-col gap-1">
                <a
                  href="mailto:hello@verifyhire.com"
                  className="text-[#1a1a2e] text-sm underline underline-offset-2 hover:text-orange-500 transition-colors"
                >
                  hello@verifyhire.com
                </a>
                <a
                  href="mailto:support@verifyhire.com"
                  className="text-[#1a1a2e] text-sm underline underline-offset-2 hover:text-orange-500 transition-colors"
                >
                  support@verifyhire.com
                </a>
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-[#1a1a2e] font-bold text-sm mb-3">Social</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                >
                  <FaTwitter className="text-base" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                >
                  <FaInstagram className="text-base" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-[#0077B5] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                >
                  <FaLinkedinIn className="text-base" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 VerifyHire. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
