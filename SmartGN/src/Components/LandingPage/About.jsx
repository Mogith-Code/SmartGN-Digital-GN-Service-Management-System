import React from 'react'
import { useLanguage } from '../../utils/translate';
function About() {
  const { lang } = useLanguage();

   const aboutTranslations = {
    EN: {
      aboutTitle: "About SmartGN",
      aboutDesc: "SmartGN is a modern digital initiative designed to transform the traditional Grama Niladhari service into a high-speed, transparent, and user-friendly experience. We aim to bridge the gap between village-level administration and citizens by leveraging the latest technology to ensure every resident can access essential services from the comfort of their home.",
      objectivesTitle: "Our Objectives",
      objectives: [
        { title: "Digital Transformation", desc: "Moving manual paperwork and physical registers into a secure, cloud-based management system." },
        { title: "Service Accessibility", desc: "Ensuring that residents in even the most remote villages can request official documents and aid with a smartphone." },
        { title: "Enhanced Transparency", desc: "Providing real-time tracking for applications so citizens know exactly when their requests are processed." },
        { title: "Disaster Readiness", desc: "Establishing a direct digital link for emergency alerts and rapid distribution of relief allowances." },
        { title: "Inclusivity", desc: "Offering a multilingual interface in Sinhala, Tamil, and English to serve every citizen in Sri Lanka equally." }
      ]
    },
    SI: {
      aboutTitle: "SmartGN පිළිබඳව",
      aboutDesc: "SmartGN යනු සාම්ප්‍රදායික ග්‍රාම නිලධාරී සේවාව වඩාත් වේගවත්, විනිවිදභාවයකින් යුත් සහ පරිශීලක-හිතකාමී අත්දැකීමක් බවට පත් කිරීම සඳහා නිර්මාණය කර ඇති නවීන ඩිජිටල් මුලපිරීමකි. සෑම පදිංචිකරුවෙකුටම තමාගේම නිවසේ සිට අත්‍යවශ්‍ය සේවාවන් ලබාගත හැකි වන පරිදි නවීන තාක්ෂණය උපයෝගී කර ගනිමින් ගම් මට්ටමේ පරිපාලනය සහ පුරවැසියන් අතර පරතරය පියවීම අපගේ අරමුණයි.",
      objectivesTitle: "අපගේ අරමුණු",
      objectives: [
        { title: "ඩිජිටල් පරිවර්තනය", desc: "අතින් ලියන ලද ලිපිලේඛන සහ භෞතික ලේඛන ආරක්ෂිත, වලාකුළු මත පදනම් වූ කළමනාකරණ පද්ධතියක් වෙත ගෙනයාම." },
        { title: "සේවා ප්‍රවේශ්‍යතාවය", desc: "වඩාත්ම දුරස්ථ ගම්මානවල පදිංචිකරුවන්ට පවා ස්මාර්ට් ජංගම දුරකතනයකින් නිල ලේඛන සහ ආධාර ඉල්ලා සිටීමට හැකි බව සහතික කිරීම." },
        { title: "වැඩි දියුණු කළ විනිවිදභාවය", desc: "පුරවැසියන් තමන්ගේ ඉල්ලීම් සකසන්නේ කවදාදැයි හරියටම දැන ගැනීමට යෙදුම් සඳහා තත්‍ය කාලීන ලුහුබැඳීම ලබා දීම." },
        { title: "ආපදා සූදානම", desc: "හදිසි ඇඟවීම් සහ සහන දීමනා වේගයෙන් බෙදා හැරීම සඳහා සෘජු ඩිජිටල් සබැඳියක් ස්ථාපිත කිරීම." },
        { title: "ඇතුළත් කිරීම", desc: "ශ්‍රී ලංකාවේ සෑම පුරවැසියෙකුටම එක හා සමානව සේවය කිරීම සඳහා සිංහල, දෙමළ සහ ඉංග්‍රීසි භාෂාවලින් බහුභාෂා අතුරු මුහුණතක් පිරිනැමීම." }
      ]
    },
    TA: {
      aboutTitle: "SmartGN பற்றி",
      aboutDesc: "SmartGN என்பது பாரம்பரிய கிராம நிலதாரி சேவையை அதிவேகமான, வெளிப்படையான மற்றும் பயனர் நட்பு அனுபவமாக மாற்றுவதற்காக வடிவமைக்கப்பட்ட ஒரு நவீன டிஜிட்டல் முயற்சியாகும். ஒவ்வொரு குடிமகனும் தங்கள் வீட்டில் இருந்தபடியே அத்தியாவசிய சேவைகளைப் பெறுவதை உறுதி செய்வதற்காக கிராம அளவிலான நிர்வாகத்திற்கும் குடிமக்களுக்கும் இடையிலான இடைவெளியை நவீன தொழில்நுட்பத்தின் மூலம் குறைப்பதே எங்கள் நோக்கமாகும்.",
      objectivesTitle: "எங்கள் நோக்கங்கள்",
      objectives: [
        { title: "டிஜிட்டல் மாற்றம்", desc: "கையேடு ஆவணங்கள் மற்றும் பதிவேடுகளை பாதுகாப்பான, கிளவுட் அடிப்படையிலான மேலாண்மை முறைக்கு மாற்றுதல்." },
        { title: "சேவை அணுகல்", desc: "தொலைதூர கிராமங்களில் வசிக்கும் குடியிருப்பாளர்களும் ஸ்மார்ட்போன் மூலம் அதிகாரப்பூர்வ ஆவணங்களையும் உதவிகளையும் கோர முடியும் என்பதை உறுதி செய்தல்." },
        { title: "மேம்படுத்தப்பட்ட வெளிப்படைத்தன்மை", desc: "விண்ணப்பங்களை நிகழ்நேரத்தில் கண்காணிப்பதன் மூலம் குடிமக்கள் தங்கள் கோரிக்கைகள் எப்போது பரிசீலிக்கப்படுகின்றன என்பதை அறிதல்." },
        { title: "பேரழிவு ஆயத்தம்", desc: "அவசர எச்சரிக்கைகள் மற்றும் நிவாரணக் கொடுப்பனவுகளை விரைவாக விநியோகிக்க நேரடி டிஜிட்டல் இணைப்பை உருவாக்குதல்." },
        { title: "அனைவரையும் உள்ளடக்குதல்", desc: "இலங்கையில் உள்ள அனைத்து குடிமக்களுக்கும் சமமாக சேவை செய்வதற்காக சிங்களம், தமிழ் மற்றும் ஆங்கிலத்தில் பன்மொழி இடைமுகத்தை வழங்குதல்." }
      ]
    }
  };

  const t = aboutTranslations[lang]
  return (
     <section id="about" className="w-full bg-[#F7FAFC] px-[100px] py-[30px] max-lg:px-[60px] max-md:p-[20px]">
      {/* Two-column layout: about-container (left) and objectives-container (right) */}
      <div className="flex items-start justify-center gap-5 max-md:flex-col border border-[green]">
        
      {/* LEFT COLUMN: ABOUT CONTAINER */}
        <div className="w-[580px] max-lg:w-full flex flex-col gap-5 items-center">
          
          {/* TEXT CONTAINER - White background as shown in image */}
          <div className="w-full py-[30px] px-20 bg-[#E2E8F0] border border-[#2D37484D] rounded-[25px] max-md:p-[20px]">
            <h2 className="text-[20px] max-md:text-[16px] text-center font-medium text-[#1B365D] mb-2.5">
              {t.aboutTitle}
            </h2>
            <p className="text-[16px] max-md:text-[12px] font-normal text-[#2D3748] text-justify leading-relaxed">
              {t.aboutDesc}
            </p>
          </div>
          
          <div className="w-full flex justify-center">
            <img src="/favicon.png" alt="SmartGN - Digital Grama Niladhari Service Management System" className="w-[200px] max-md:w-[100px] opacity-[50%] h-auto object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="w-[580px] py-[30px] px-20 bg-[#E2E8F0] border border-[#2D37484D] rounded-[25px] max-md:w-full max-md:p-[20px]">
          
          <h2 className="text-[20px] max-md:text-[16px] text-center font-medium text-[#1B365D] mb-2.5">
             {t.objectivesTitle}
          </h2>
              <ul>
              {t.objectives.map((objective, index) => (
              <li key={index} className="list-disc text-[16px] font-normal text-[#2D3748] max-md:text-[12px] max-md:ml-[15px] border border-[red]">
                  <strong>{objective.title}:</strong> {objective.desc}
              </li>
            ))}
            </ul>  
        </div>
      </div>
    </section>
  )
}

export default About