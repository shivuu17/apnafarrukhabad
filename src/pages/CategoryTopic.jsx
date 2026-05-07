import { useParams } from 'react-router-dom'
import CommonPageShell from '../components/CommonPageShell'

function CategoryTopic() {
  const { slug } = useParams()

  const categories = {
    agriculture: {
      title: 'Agriculture',
      subtitle: 'Latest farming updates, crop guidance, and mandi news',
      items: [
        'Farmers adopted new irrigation practices this week.',
        'Wheat crop advisory issued for local villages.',
        'Mandi price updates are stable in the district market.',
      ],
    },
    education: {
      title: 'Education',
      subtitle: 'School news, exams, and learning updates',
      items: [
        'Admissions and scholarship updates are now live.',
        'Local schools shared their exam preparation schedule.',
        'A new digital learning drive is starting this month.',
      ],
    },
    health: {
      title: 'Health',
      subtitle: 'Health camps, alerts, and public service notices',
      items: [
        'A free health camp was organized in the village center.',
        'Doctors advised residents on seasonal illness prevention.',
        'Vaccination and maternal health awareness programs continue.',
      ],
    },
    infrastructure: {
      title: 'Infrastructure',
      subtitle: 'Roads, water, electricity, and civic updates',
      items: [
        'Road repair work has begun near the main market area.',
        'Drainage cleaning is underway in the affected wards.',
        'Electricity maintenance schedule has been published.',
      ],
    },
    weather: {
      title: 'Weather',
      subtitle: 'Forecasts, rain alerts, and climate advisories',
      items: [
        'Rain is expected in the evening with cooler winds.',
        'Humidity levels remain moderate across the district.',
        'Farmers are advised to check the weather before spraying.',
      ],
    },
    business: {
      title: 'Business',
      subtitle: 'Local shops, services, and market movement',
      items: [
        'Small businesses reported steady weekend customer traffic.',
        'New service stalls opened near the transport stand.',
        'Retailers shared offers ahead of the festive season.',
      ],
    },
    sports: {
      title: 'Sports',
      subtitle: 'Matches, tournaments, and youth activities',
      items: [
        'Village cricket trials are scheduled for this weekend.',
        'Students are preparing for the district sports meet.',
        'A friendly volleyball tournament starts tomorrow.',
      ],
    },
    government: {
      title: 'Government',
      subtitle: 'Policy updates, announcements, and public notices',
      items: [
        'New government schemes launched for farmer support this quarter.',
        'Officials announced upcoming development projects in districts.',
        'Public notice issued for application submissions by next week.',
      ],
    },
    commodities: {
      title: 'Mandi Rates',
      subtitle: 'Market prices, trading updates, and commodity news',
      items: [
        'Wheat prices showed an upward trend in the mandi this week.',
        'Rice trading volume increased with better quality produce.',
        'Vegetable prices stabilized after recent market fluctuations.',
      ],
    },
  }

  const category = categories[slug] || categories.agriculture

  return (
    <CommonPageShell title={category.title} subtitle={category.subtitle}>
      <div className="grid gap-4 lg:grid-cols-3">
        {category.items.map((item, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm leading-6 text-slate-600">{item}</p>
          </div>
        ))}
      </div>
    </CommonPageShell>
  )
}

export default CategoryTopic
