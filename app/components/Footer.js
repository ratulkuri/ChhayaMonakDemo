import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-[#30bd82]" />
                <span>+974 1234 5678</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-[#30bd82]" />
                <span>support@insurance.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-[#30bd82]" />
                <span>Doha, Qatar</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#30bd82] transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-[#30bd82] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#30bd82] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#30bd82] transition-colors">Claims Process</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Legal Information</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              This insurance is underwritten by licensed insurers in Bangladesh. 
              Coverage is subject to policy terms and conditions. Please read 
              all policy documents carefully before purchase.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Bangladesh Expat Insurance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
