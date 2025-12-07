import footerBg from '../assets/footer.jpg'
import logo from '../assets/logo.png'

export default function Footer({ config = {} }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full pt-12 pb-20 sm:pt-16 sm:pb-10 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-30"
        style={{ 
          backgroundImage: config.footer_bg_image_url 
            ? `url(${config.footer_bg_image_url})`
            : `url(${footerBg})`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <img 
              src={logo} 
              alt="radium.lol" 
              className="h-5 w-auto opacity-60"
            />
            <p className="text-gray-400 text-sm sm:text-base">
              © {currentYear}
            </p>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm text-center order-first sm:order-none">
            Create your own customizable portfolio page
          </p>
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-right">
            made with ❤️ by the deyo
          </p>
        </div>
      </div>
    </footer>
  )
}
