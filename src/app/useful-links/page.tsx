import { ExternalLink } from "lucide-react";

const categories = [
  {
    title: "Government & Boards",
    color: "border-green-500",
    links: [
      { name: "Coconut Development Board (India)", url: "https://coconutboard.gov.in", desc: "Subsidies, schemes, and coconut cultivation support" },
      { name: "Tamil Nadu Agriculture Dept.", url: "https://agri.tn.gov.in", desc: "State-level schemes, crop insurance, soil testing" },
      { name: "TNAU – Coconut Resources", url: "https://www.tnau.ac.in", desc: "Tamil Nadu Agricultural University research & advisories" },
      { name: "Horticulture Dept. Tamil Nadu", url: "https://tnhorticulture.tn.gov.in", desc: "Plantation crop support and training programs" },
      { name: "PM Kisan Portal", url: "https://pmkisan.gov.in", desc: "Central farmer income support scheme registration" },
    ],
  },
  {
    title: "Pest & Disease Help",
    color: "border-red-500",
    links: [
      { name: "TNAU Coconut Expert System (Tamil)", url: "https://play.google.com/store/apps/details?id=com.cdac.tnau_coconut_tamil", desc: "App for coconut pest/disease identification in Tamil" },
      { name: "Plantix App", url: "https://plantix.net", desc: "AI-based crop disease photo identification — free" },
      { name: "Coconut Board – Pest Management", url: "https://coconutboard.gov.in/pest.htm", desc: "Official guide for rhinoceros beetle, bud rot, wilt" },
      { name: "National Plant Protection Org.", url: "https://nppo.dac.gov.in", desc: "Pesticide guidelines and quarantine pest info" },
    ],
  },
  {
    title: "Market Prices",
    color: "border-yellow-500",
    links: [
      { name: "Agmarknet – Coconut Prices", url: "https://agmarknet.gov.in", desc: "Live mandi prices for coconut across Tamil Nadu" },
      { name: "Tamil Nadu APMC", url: "https://www.agrimarket.tn.gov.in", desc: "State regulated market commodity prices" },
      { name: "e-NAM Platform", url: "https://enam.gov.in", desc: "National Agriculture Market — online trading" },
      { name: "Coconut Board Minimum Price", url: "https://coconutboard.gov.in/MinimumSupportPrice.aspx", desc: "Minimum support price notifications" },
    ],
  },
  {
    title: "Subsidies & Finance",
    color: "border-blue-500",
    links: [
      { name: "Coconut Board Subsidy Schemes", url: "https://coconutboard.gov.in/schemes.htm", desc: "MIDH scheme, drip irrigation, replanting subsidies" },
      { name: "NABARD – Farm Loans", url: "https://www.nabard.org", desc: "Agriculture credit and rural development schemes" },
      { name: "Kisan Credit Card", url: "https://pmkisan.gov.in", desc: "Credit for input costs at concessional interest rates" },
      { name: "TN Horticulture Subsidy", url: "https://tnhorticulture.tn.gov.in/schemes.php", desc: "State schemes for coconut farmers" },
    ],
  },
  {
    title: "Weather & Soil",
    color: "border-cyan-500",
    links: [
      { name: "IMD Agromet Advisory", url: "https://agromet.imd.gov.in", desc: "District-wise weather forecast for farmers" },
      { name: "Meghdoot App", url: "https://play.google.com/store/apps/details?id=in.imd.meghdoot", desc: "IMD app with local agro-weather alerts" },
      { name: "Soil Health Card Portal", url: "https://soilhealth.dac.gov.in", desc: "Check your soil test report and fertiliser recommendation" },
      { name: "TNAU Weather Station", url: "https://www.tnau.ac.in/weather", desc: "Coimbatore & regional weather data" },
    ],
  },
  {
    title: "Learning & Research",
    color: "border-purple-500",
    links: [
      { name: "Coconut Board Publication Library", url: "https://coconutboard.gov.in/publications.htm", desc: "Free guides on cultivation, pest control, post-harvest" },
      { name: "ICAR – Coconut Research", url: "https://www.icar.org.in", desc: "National research on coconut varieties and practices" },
      { name: "YouTube – TNAU Extension", url: "https://www.youtube.com/@TNAUAgriOfficial", desc: "Tamil language agriculture extension videos" },
      { name: "Kisan Suvidha App", url: "https://play.google.com/store/apps/details?id=com.nic.moa.kisansuvidha", desc: "All-in-one farmer helpline and market info app" },
    ],
  },
];

export default function UsefulLinks() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Useful Links</h1>
        <p className="text-gray-500 text-sm mt-1">Tamil Nadu coconut farming — government, pest, market, and subsidy resources</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {categories.map(cat => (
          <div key={cat.title} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden border-t-4 ${cat.color}`}>
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-700">{cat.title}</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {cat.links.map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                >
                  <ExternalLink className="text-gray-300 group-hover:text-green-600 mt-0.5 shrink-0 transition-colors" size={15} />
                  <div>
                    <div className="text-sm font-medium text-gray-800 group-hover:text-green-700 transition-colors">{link.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{link.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
