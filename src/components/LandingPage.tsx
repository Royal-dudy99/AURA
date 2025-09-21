import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import { ArrowRight, Brain, Target, Sparkles, Moon, Sun} from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { ANIMATION_CONFIG, FEATURES } from '@/lib/constants'

export default function LandingPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine)
  }, [])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={ANIMATION_CONFIG}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-aura flex items-center justify-center animate-pulse-glow">
            <div className="w-6 h-6 rounded-full bg-white/20" />
          </div>
          <span className="text-2xl font-bold gradient-text">AURA</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => changeLanguage('en')}
            className={`p-2 rounded-lg transition-colors ${
              i18n.language === 'en' ? 'bg-aura-cyan/20' : 'hover:bg-white/10'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage('es')}
            className={`p-2 rounded-lg transition-colors ${
              i18n.language === 'es' ? 'bg-aura-cyan/20' : 'hover:bg-white/10'
            }`}
          >
            ES
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => navigate('/login')}
            className="btn-secondary text-sm"
          >
            {t('landing.signIn')}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className="text-center py-16 md:py-24">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass border border-white/20 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2 text-aura-cyan" />
              <span className="text-sm text-gray-300">{t('landing.badge')}</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
              <span className="gradient-text">Focus smarter.</span>
              <br />
              <span className="gradient-text">Create faster.</span>
              <br />
              <span className="gradient-text">Live brighter.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              {t('landing.description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={() => navigate('/signup')}
                className="btn-primary flex items-center text-lg px-8 py-4 animate-pulse-glow"
              >
                {t('landing.getStarted')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary text-lg px-8 py-4"
              >
                {t('landing.tryDemo')}
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className="card text-center group hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-aura flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                  {feature.icon === 'brain' && <Brain className="w-8 h-8 text-white" />}
                  {feature.icon === 'target' && <Target className="w-8 h-8 text-white" />}
                  {feature.icon === 'sparkles' && <Sparkles className="w-8 h-8 text-white" />}
                </div>
                
                <h3 className="text-xl font-semibold mb-4 gradient-text">
                  {t(`landing.features.${feature.title.toLowerCase().replace(/\s+/g, '')}.title`)}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {t(`landing.features.${feature.title.toLowerCase().replace(/\s+/g, '')}.description`)}
                </p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="glass rounded-3xl p-8 md:p-12 mb-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">
              {t('landing.stats.title')}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '50K+', label: t('landing.stats.users') },
                { value: '1M+', label: t('landing.stats.notes') },
                { value: '500K+', label: t('landing.stats.habits') },
                { value: '98%', label: t('landing.stats.satisfaction') },
              ].map((stat, index) => (
                <div key={stat.label} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center pb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('landing.cta.title')}
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('landing.cta.description')}
            </p>
            
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary text-xl px-12 py-6 animate-pulse-glow"
            >
              {t('landing.cta.button')}
              <ArrowRight className="ml-3 w-6 h-6" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-6 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-gradient-aura flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-white/20" />
            </div>
            <span className="text-lg font-bold gradient-text">AURA</span>
          </div>
          
          <div className="text-gray-400 text-sm">
            © 2024 AURA. {t('landing.footer.rights')}
          </div>
        </div>
      </footer>
    </div>
  )
}
