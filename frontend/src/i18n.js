import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English Translations
const en = {
  translation: {
    nav: {
      marketplace: "Marketplace",
      farmerDashboard: "Farmer Dashboard",
      cart: "Cart",
      logout: "Logout",
      appTitle: "Krishi Cart"
    },
    login: {
      livePlatform: "Live Platform",
      title1: "Empowering Local",
      title2: "Agriculture",
      subtitle: "Connect directly. Trade fairly. Grow together. Join thousands of farmers and consumers on Krishi Cart.",
      welcome: "Welcome Back",
      welcomeSub: "Sign in to your Krishi Cart account",
      farmer: "Farmer",
      consumer: "Consumer",
      vendor: "Vendor",
      phoneEmail: "Phone Number / Email",
      phonePlaceholder: "Enter your credentials",
      password: "Password / OTP",
      passwordPlaceholder: "••••••••",
      remember: "Remember me",
      forgot: "Forgot password?",
      signIn: "Sign In as",
      signUp: "Sign up now",
      createAccount: "Create Account",
      signupSub: "Join the Krishi Cart community",
      fullName: "Full Name",
      namePlaceholder: "Enter your full name",
      agreeTerms: "I agree to the Terms & Conditions",
      alreadyAccount: "Already have an account?",
      resetPassword: "Reset Password",
      forgotSub: "Enter your email/phone to receive a reset link",
      sendLink: "Send Reset Link",
      backToLogin: "Back to Login"
    },
    farmer: {
      dashboard: "Farmer Dashboard",
      manage: "Manage your produce and track live orders.",
      analytics: "View Analytics",
      listNew: "List New Produce",
      produceName: "Produce Name",
      namePlaceholder: "e.g. Tomatoes",
      qty: "Quantity (kg)",
      qtyPlaceholder: "e.g. 50kg",
      price: "Price per kg (₹)",
      pricePlaceholder: "e.g. 20",
      publish: "Publish to Marketplace",
      currentInv: "Current Inventory",
      items: "Items",
      colProduce: "Produce",
      colQty: "Available Qty",
      colPrice: "Price/kg",
      colStatus: "Status",
      liveOrders: "Live Orders",
      buyer: "Buyer:",
      update: "Update",
      noOrders: "No active orders yet. They will appear here when customers buy your produce.",
      aiSuggest: "✨ AI Suggest",
      aiAnalyzing: "Analyzing market...",
      aiSuggested: "AI Suggested Price based on local demand"
    },
    marketplace: {
      title: "Fresh Marketplace",
      subtitle: "Direct from farms to your table.",
      search: "Search produce or farmers...",
      available: "Available Stock:",
      addToCart: "Add to Cart",
      noProduce: "No produce found",
      tryAdjusting: "Try adjusting your search terms or filters.",
      traceOrigin: "Trace Origin",
      farmDetails: "Farm Origin Details",
      harvestDate: "Harvest Date:",
      location: "Location:",
      farmerBio: "Farmer:",
      close: "Close"
    },
    checkout: {
      back: "Back to Marketplace",
      stepCart: "Your Cart",
      stepPayment: "Payment Method",
      qty: "Qty:",
      from: "From",
      upi: "UPI / Credit Card",
      cod: "Cash on Delivery",
      summary: "Order Summary",
      subtotal: "Subtotal",
      delivery: "Delivery Fee",
      platform: "Platform Fee",
      total: "Total",
      proceed: "Proceed to Pay",
      paySecurely: "Pay Securely",
      processing: "Processing...",
      securePayment: "Payments are secured by Krishi Cart Escrow. The farmer receives funds only after successful delivery.",
      confirmed: "Order Confirmed!",
      confirmedSub1: "Your order has been placed directly with",
      confirmedSub2: ". A delivery agent will be assigned shortly.",
      deliveryExpected: "Delivery expected by",
      tomorrow: "Tomorrow, 10 AM",
      securedVia: "Payment secured via",
      escrow: "Krishi Cart Escrow",
      continue: "Continue Shopping"
    }
  }
};

// Hindi Translations
const hi = {
  translation: {
    nav: {
      marketplace: "बाज़ार",
      farmerDashboard: "किसान डैशबोर्ड",
      cart: "कार्ट",
      logout: "लॉग आउट",
      appTitle: "कृषि कार्ट"
    },
    login: {
      livePlatform: "लाइव प्लेटफ़ॉर्म",
      title1: "स्थानीय",
      title2: "कृषि का सशक्तिकरण",
      subtitle: "सीधे जुड़ें। निष्पक्ष व्यापार करें। साथ बढ़ें। कृषि कार्ट पर हजारों किसानों और उपभोक्ताओं से जुड़ें।",
      welcome: "वापसी पर स्वागत है",
      welcomeSub: "अपने कृषि कार्ट खाते में साइन इन करें",
      farmer: "किसान",
      consumer: "उपभोक्ता",
      vendor: "विक्रेता",
      phoneEmail: "फ़ोन नंबर / ईमेल",
      phonePlaceholder: "अपनी साख दर्ज करें",
      password: "पासवर्ड / ओटीपी",
      passwordPlaceholder: "••••••••",
      remember: "मुझे याद रखें",
      forgot: "पासवर्ड भूल गए?",
      signIn: "साइन इन करें",
      noAccount: "खाता नहीं है?",
      signUp: "अभी साइन अप करें",
      createAccount: "खाता बनाएं",
      signupSub: "कृषि कार्ट समुदाय में शामिल हों",
      fullName: "पूरा नाम",
      namePlaceholder: "अपना पूरा नाम दर्ज करें",
      agreeTerms: "मैं नियमों और शर्तों से सहमत हूँ",
      alreadyAccount: "पहले से ही खाता है?",
      resetPassword: "पासवर्ड रीसेट करें",
      forgotSub: "रीसेट लिंक प्राप्त करने के लिए अपना ईमेल/फोन दर्ज करें",
      sendLink: "रीसेट लिंक भेजें",
      backToLogin: "लॉगिन पर वापस जाएं"
    },
    farmer: {
      dashboard: "किसान डैशबोर्ड",
      manage: "अपनी उपज प्रबंधित करें और लाइव ऑर्डर ट्रैक करें।",
      analytics: "एनालिटिक्स देखें",
      listNew: "नई उपज सूचीबद्ध करें",
      produceName: "उपज का नाम",
      namePlaceholder: "जैसे: टमाटर",
      qty: "मात्रा (किलो)",
      qtyPlaceholder: "जैसे: 50kg",
      price: "मूल्य प्रति किलो (₹)",
      pricePlaceholder: "जैसे: 20",
      publish: "बाज़ार में प्रकाशित करें",
      currentInv: "वर्तमान इन्वेंटरी",
      items: "आइटम",
      colProduce: "उपज",
      colQty: "उपलब्ध मात्रा",
      colPrice: "मूल्य/किलो",
      colStatus: "स्थिति",
      liveOrders: "लाइव ऑर्डर",
      buyer: "खरीदार:",
      update: "अपडेट",
      noOrders: "अभी तक कोई सक्रिय ऑर्डर नहीं। जब ग्राहक आपकी उपज खरीदेंगे तो वे यहाँ दिखाई देंगे।",
      aiSuggest: "✨ एआई सुझाव",
      aiAnalyzing: "बाज़ार का विश्लेषण...",
      aiSuggested: "स्थानीय मांग के आधार पर एआई सुझाया गया मूल्य"
    },
    marketplace: {
      title: "ताज़ा बाज़ार",
      subtitle: "खेतों से सीधे आपकी मेज तक।",
      search: "उपज या किसानों को खोजें...",
      available: "उपलब्ध स्टॉक:",
      addToCart: "कार्ट में डालें",
      noProduce: "कोई उपज नहीं मिली",
      tryAdjusting: "अपने खोज शब्द या फ़िल्टर समायोजित करने का प्रयास करें।",
      traceOrigin: "उत्पत्ति का पता लगाएं",
      farmDetails: "खेत उत्पत्ति विवरण",
      harvestDate: "कटाई की तारीख:",
      location: "स्थान:",
      farmerBio: "किसान:",
      close: "बंद करें"
    },
    checkout: {
      back: "बाज़ार पर वापस जाएँ",
      stepCart: "आपका कार्ट",
      stepPayment: "भुगतान विधि",
      qty: "मात्रा:",
      from: "से",
      upi: "यूपीआई / क्रेडिट कार्ड",
      cod: "कैश ऑन डिलीवरी",
      summary: "ऑर्डर सारांश",
      subtotal: "उप-योग",
      delivery: "डिलीवरी शुल्क",
      platform: "प्लेटफ़ॉर्म शुल्क",
      total: "कुल",
      proceed: "भुगतान के लिए आगे बढ़ें",
      paySecurely: "सुरक्षित रूप से भुगतान करें",
      processing: "प्रसंस्करण...",
      securePayment: "भुगतान कृषि कार्ट एस्क्रो द्वारा सुरक्षित हैं। किसान को सफल डिलीवरी के बाद ही धनराशि मिलती है।",
      confirmed: "ऑर्डर की पुष्टि हो गई!",
      confirmedSub1: "आपका ऑर्डर सीधे",
      confirmedSub2: "के पास दिया गया है। जल्द ही एक डिलीवरी एजेंट नियुक्त किया जाएगा।",
      deliveryExpected: "डिलीवरी की उम्मीद:",
      tomorrow: "कल, सुबह 10 बजे",
      securedVia: "द्वारा सुरक्षित भुगतान:",
      escrow: "कृषि कार्ट एस्क्रो",
      continue: "खरीदारी जारी रखें"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      hi
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
