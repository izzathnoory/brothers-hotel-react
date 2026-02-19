import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

const translations = {
    en: {
        home: 'Home',
        menu: 'Menu',
        gallery: 'Gallery',
        about: 'About Us',
        dashboard: 'Dashboard',
        orderNow: 'Order Now',
        welcome: 'Welcome to Brothers Hotel',
        tagline: 'Serving Authentic Sri Lankan Flavours',
        viewMenu: 'View Menu',
        findUs: 'Find Us',
        ourStory: 'Our Story',
        openDaily: 'Open Daily',
        location: 'Location',
        yearsService: 'Years of Service',
        galleryTitle: 'Gallery',
        gallerySubtitle: 'Glimpses of our ambiance and culinary creations',
        aboutTitle: 'Our Story & Legacy',
        aboutSubtitle: 'Serving authentic flavours since 2013',
        getInTouch: 'Visit Us',
        sendMessage: 'Send us a Message',
        name: 'Your Name',
        email: 'Email Address',
        subject: 'Subject',
        message: 'Message',
        send: 'Send Message',
        search: 'Search menu...',
        all: 'All',
        adminLogin: 'Admin Login',
        login: 'Login',
        manageMenu: 'Manage Menu',
        manageGallery: 'Manage Gallery',
        manageReviews: 'Manage Reviews',
        settings: 'Settings',
        signOut: 'Sign Out'
    },
    ta: {
        home: 'முகப்பு',
        menu: 'பட்டியல்',
        gallery: 'கேலரி',
        about: 'எங்களைப் பற்றி',
        dashboard: 'நிர்வாக பலகை',
        orderNow: 'இப்போதே ஆர்டர்',
        welcome: 'பிரதர்ஸ் ஹோட்டலுக்கு வரவேற்கிறோம்',
        tagline: 'உண்மையான இலங்கை சுவைகளை வழங்குகிறது',
        viewMenu: 'பட்டியலைப் பார்',
        findUs: 'எங்களை கண்டுபிடி',
        ourStory: 'எங்கள் கதை',
        openDaily: 'தினமும் திறந்திருக்கும்',
        location: 'இடம்',
        yearsService: 'வருட சேவை',
        galleryTitle: 'கேலரி',
        gallerySubtitle: 'எங்கள் சூழல் மற்றும் சமையல் படைப்புகள்',
        aboutTitle: 'எங்கள் கதை & பாரம்பரியம்',
        aboutSubtitle: '2013 முதல் உண்மையான சுவைகளை வழங்குகிறது',
        getInTouch: 'எங்களைப் பார்வையிடவும்',
        sendMessage: 'செய்தி அனுப்புங்கள்',
        name: 'பெயர்',
        email: 'மின்னஞ்சல்',
        subject: 'பொருள்',
        message: 'செய்தி',
        send: 'அனுப்பு',
        search: 'தேடு...',
        all: 'அனைத்தும்',
        adminLogin: 'நிர்வாக உள்நுழைவு',
        login: 'உள்நுழைய',
        manageMenu: 'பட்டியல் நிர்வாகம்',
        manageGallery: 'கேலரி நிர்வாகம்',
        manageReviews: 'விமர்சனங்கள்',
        settings: 'அமைப்புகள்',
        signOut: 'வெளியேறு'
    },
    si: {
        home: 'මුල් පිටුව',
        menu: 'මෙනුව',
        gallery: 'ගැලරිය',
        about: 'අප ගැන',
        dashboard: 'පුවරුව',
        orderNow: 'ඇණවුම් කරන්න',
        welcome: 'Brothers Hotel වෙත සාදරයෙන් පිළිගනිමු',
        tagline: 'සැබෑ ශ්‍රී ලාංකික රසයන්',
        viewMenu: 'මෙනුව බලන්න',
        findUs: 'අප සොයාගන්න',
        ourStory: 'අපගේ කතාව',
        openDaily: 'දිනපතා විවෘතයි',
        location: 'ස්ථානය',
        yearsService: 'වසර ගණනාවක සේවය',
        galleryTitle: 'ගැලරිය',
        gallerySubtitle: 'අපගේ පරිසරය සහ ආහාර',
        aboutTitle: 'අපගේ කතාව සහ උරුමය',
        aboutSubtitle: '2013 සිට',
        getInTouch: 'අප හමුවන්න',
        sendMessage: 'පණිවිඩයක් එවන්න',
        name: 'නම',
        email: 'විද්‍යුත් තැපෑල',
        subject: 'මාතෘකාව',
        message: 'පණිවිඩය',
        send: 'යවන්න',
        search: 'සොයන්න...',
        all: 'සියල්ල',
        adminLogin: 'පරිපාලක පිවිසුම',
        login: 'පිවිසෙන්න',
        manageMenu: 'මෙනුව කළමනාකරණය',
        manageGallery: 'ගැලරිය කළමනාකරණය',
        manageReviews: 'සමාලෝචන',
        settings: 'සැකසුම්',
        signOut: 'ඉවත් වන්න'
    }
}

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('en')

    const t = (key) => {
        return translations[lang][key] || key
    }

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)
