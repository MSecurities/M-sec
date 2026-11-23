import type { Dictionary } from './types';

export const en: Dictionary = {
  faq: {
    title: "Frequently Asked Questions",
    onlineTrading: {
      title: "Online Trading",
      howTo: {
        title: "How to participate in online trading?",
        description1: 'To open an online account with M Securities SC LLC, go to https://trader.msecurities.mn/auth/login and click the "Register" button. Once your securities account is opened, you will have the right to trade.',
        description2: "Your account will be opened within 24 hours of receiving your request, after which you can participate fully in trading via https://trader.msecurities.mn/auth/login.",
        note: "Note: If you enter incomplete or incorrect personal information when opening an account, your account may not be opened. Please enter your personal information accurately and upload a clear, high-quality photo.",
      },
    },
    accountManagement: {
      title: "Account Management",
      forgotPassword: {
        title: "In case you forget your password",
        description: 'Log in to the https://trader.msecurities.mn/auth/login website or app and click "Forgot password" to recover and update your username and password.',
      },
    },
    contact: {
      title: "Contact Information",
      subtitle: "For information on securities trading",
      phone: "Phone",
      email: "Email",
    },
    commonQuestions: {
      title: "Frequently Asked Questions",
      questions: [
        {
          question: "What are stocks and bonds, and how do they differ?",
          answer: "A stock is a security representing a shareholder's ownership stake in a company. A bond is a security representing a debt of a company or government body, which the issuer must repay with principal and interest after a set period.\n\nThe difference: Shareholders are entitled to dividends from the company's profits and to voting rights, whereas bondholders are creditors and are entitled only to fixed interest.",
        },
        {
          question: "What is a dividend?",
          answer: "A dividend is the portion of a company's profit distributed to shareholders, either in cash or additional shares.",
        },
        {
          question: "What is the difference between the primary and secondary markets?",
          answer: "Primary market: Where companies issue new securities to investors for the first time (e.g., IPO).\n\nSecondary market: Where investors trade existing securities with each other.",
        },
        {
          question: "What does opening an account with a securities company mean?",
          answer: "By opening an account with a securities company, you become an official investor able to buy, sell and hold securities on the capital market.",
        },
        {
          question: "What are nominee and beneficiary accounts? What is a CSD account?",
          answer: "Nominee account: Opened at a brokerage; securities are held in the brokerage's name on your behalf.\n\nBeneficiary account: Your personal ownership account registered with the Central Securities Depository (CSD).\n\nCSD account: The official system where all securities are registered, held, and transferred.",
        },
        {
          question: "How are trades executed?",
          answer: "All trades are carried out through the Mongolian Stock Exchange's electronic trading system. Orders are placed via your brokerage and matched according to market price.",
        },
        {
          question: "How can I sell my securities and receive money?",
          answer: "Submit a sell order to your brokerage. After execution, securities are transferred, and funds are credited to your linked bank account.",
        },
        {
          question: "What is KYC?",
          answer: 'KYC ("Know Your Customer") is a mandatory verification process where brokerages confirm client identity and background in compliance with regulations.',
        },
        {
          question: "Can I transfer my securities to another person?",
          answer: "Yes. You may transfer your securities through your brokerage by submitting a transfer request, which will be officially registered.",
        },
        {
          question: "Do I have to pay fees and taxes?",
          answer: "Trading fees: Brokerage and exchange transaction fees apply.\n\nTaxes: A 10% capital gains tax applies when you sell securities at a profit.",
        },
        {
          question: "Can I open an account if I already use another brokerage?",
          answer: "Yes. Investors may hold accounts with up to five brokerages and transfer their securities as needed.",
        },
      ],
      trading: {
        title: "Trading Information",
        questions: [
          {
            question: "What are the trading hours of the Mongolian Stock Exchange?",
            answer: "On business days:\n\n09:00–10:00 – Pre-open (order collection)\n\n10:00–13:00 – Trading session\n\nAfter 13:00 – Post-trade processing\n\nYou may submit orders at any time before these hours; your orders are executed during trading hours.",
          },
          {
            question: "Is it possible that my order will not be executed?",
            answer: "Yes, your order may not be executed for the following reasons:\n\n· The price you offered does not match the market price;\n\n· There is no matching counter-order in the market;\n\n· Your account does not have sufficient funds or securities.",
          },
          {
            question: "When do I pay for the securities I buy?",
            answer: "You must deposit sufficient funds into your trading account before placing a buy order. Your order enters the trading system and is executed and settled only if your account has sufficient funds.",
          },
          {
            question: "When will I receive the proceeds from selling securities?",
            answer: "After your securities are sold, the proceeds are transferred via the securities company's account to your linked bank account on the second business day after the trade date (T+2).",
          },
        ],
      },
      account: {
        title: "Account Information",
        questions: [
          {
            question: "How to open an account?",
            answer: "Register online or visit us in person at New Horizons Office, 4th floor, Room 401.",
          },
          {
            question: "How to deposit funds?",
            answer: 'Log in to https://trader.msecurities.mn/dashboard/app with your account, click "DEPOSIT" at the top right, select the account you wish to top up and make the transfer. Be sure to enter the transaction description correctly.',
          },
          {
            question: "What if I entered the wrong transfer description?",
            answer: "Contact us by email or in person, and we'll assist you in correcting it.",
          },
        ],
      },
    },
  },
  navbar: {
    about: "About Us",
    services: "Services",
    research: "Research",
    faqs: "FAQs",
    trade: "TRADE",
    sections: {
      introduction: "Introduction",
      goal: "Mission",
      objective: "Objective",
      vision: "Vision",
      values: "Values",
      feedback: "Feedback",
      broker: "Broker",
      miningBroker: "Mining Broker",
      foreignTrading: "Foreign Trading",
      news: "News",
      analysis: "Analysis",
      commonQuestions: "Common Questions",
      weekly: "Weekly News",
      openAccount: "Open an Account",
      manageAccount: "Manage Your Account Online",
      contact: "Contact Us",
      team: "Our Team",
    },
  },
  footer: {
    tagline: "Bridge to Global Opportunity",
    quickLinks: "Quick Links",
    followUs: "Follow Us",
    contactUs: {
      title: "Contact Us",
      email: { label: "Email", value: "info@msecurities.mn" },
      phone: {
        label: "Phone",
        numbers: [
          "72270008",
          "89819938",
          "86095119",
        ],
      },
      location: { label: "Find us on Google Maps", text: "Visit our office" },
    },
    copyright: "All Rights Reserved",
    socialLinks: {
      twitter: "Follow us on X",
      instagram: "Follow us on Instagram",
      linkedin: "Follow us on LinkedIn",
      facebook: "Follow us on Facebook",
    },
    mobileApp: {
      title: "Mobile App",
      appStore: "Download on App Store",
      playStore: "Get it on Google Play",
      description: "Trade anytime, anywhere",
    },
  },
  about: {
    title: "About Us",
    objective: {
      title: "Objective",
      description: "We are a professional, knowledgeable, customer-focused, and reliable advisor based on research and analysis.",
    },
    goal: {
      title: "Mission",
      items: [
        "To offer you international financial services",
        "To become an industry leader through optimal, technology-driven investment solutions",
        "To deliver factual market news, research and analysis",
        "To be a reliable partner and a professional, ethical team",
      ],
    },
    vision: {
      title: "Vision",
      description: "To be a highly skilled professional team that competes in global financial markets and holds influence in the domestic market.",
    },
    value: {
      title: "Our Values",
      description: "Our core values guide everything we do",
      items: {
        mastery: { title: "MASTERY", description: "We strive for excellence in everything we do." },
        teamSpirit: { title: "TEAM SPIRIT", description: "Working together toward a common goal." },
        leadership: { title: "LEADERSHIP", description: "Leading by example and inspiring others." },
        mcsSpirit: { title: "MCS VALUES", description: "Upholding the core values of MCS Group." },
        creativity: { title: "CREATIVITY", description: "Seeking new solutions and innovation." },
        integrity: { title: "INTEGRITY", description: "Upholding high ethical standards." },
        sustainable: { title: "SUSTAINABLE DEVELOPMENT", description: "Building for the long-term future." },
      },
    },
    introduction: {
      title: "Introduction",
      organizationalHistory: {
        title: "Organizational History",
        description1: "M Securities SC LLC is a subsidiary of MCS Holding LLC, one of Mongolia's leading companies, and was established to provide professional products and services to participants in the Mongolian and international capital markets.",
        description2: "M Securities SC LLC strives to deliver timely information and research to securities market participants, adapt international financial standards to Mongolian conditions, and offer client-centric services combined with new technology while upholding professional ethics.",
      },
      board: {
        title: "Board of Directors",
        chairman: { name: "Myagmarjav G.", position: "Chairman of the Board" },
        member1: { name: "Temuulen B.", position: "Board Member" },
        member2: { name: "Ariunbayar B.", position: "Board Member" },
      },
    },
    team: {
      title: "Our Team",
      list: [
        { name: "Munkhjargal Kh.", position: "Chief Executive Officer" },
        { name: "Nomingerel T.", position: "Chief Accountant" },
        { name: "Telmen B.", position: "Legal Specialist" },
        { name: "Munkh-Orgil U.", position: "IT Specialist" },
        { name: "Nomundari B.", position: "Domestic Trading Broker" },
        { name: "Narankhuu S.", position: "Foreign Trading Broker" },
        { name: "Khadbaatar D.", position: "Broker" },
        { name: "Odkhuu B.", position: "Broker" },
        { name: "Amarsanaa O.", position: "Broker" },
        { name: "Khuslen B.", position: "Broker" },
      ],
    },
  },
  services: {
    title: "Our Services",
    broker: {
      title: "Broker Services",
      description: "We help you invest in the securities market and reach your financial goals. Our professional team brings you reliable brokerage services.",
      requiredDocs: {
        title: "Required Documents",
        citizen: {
          title: "For Citizens",
          items: [
            "Account opening request",
            "National ID card",
          ],
        },
        legalEntity: {
          title: "For Legal Entities",
          items: [
            "Request letter for account opening and brokerage services (2 official copies)",
            "State registration certificate (2 notarized copies)",
            "Entity charter (2 notarized copies)",
            "Signature and seal specimen of the person authorized to manage the account (2 notarized copies)",
            "Identification document of the authorized person (national ID card or passport)",
          ],
        },
        foreignCitizen: {
          title: "For Foreign Citizens",
          items: [
            "Foreign passport (2 copies)",
            "Mongolian residence permit",
            "Document proving an account at a reputable bank in Mongolia or abroad",
          ],
        },
      },
    },
    miningBroker: {
      title: "Mining Broker Services",
      requiredDocs: {
        title: "Required Documentation",
        items: [
          "Official document confirming receipt of brokerage services",
          "Legal entity registration certificate",
          "Company charter",
          "Authorized person documentation",
          "Signing authority documentation",
          "Organization certificate and power of attorney (if applicable)",
          "Tax residency certificate",
          "Official signature form and seal",
          "Bank account details",
          "Mongolian representative office information (if applicable)",
          "Shareholder and management documentation",
          "Special licenses (if required)",
          "English translations of foreign documents",
        ],
      },
    },
  },
  research: {
    title: "Research",
    news: {
      title: "News",
      description: "Stay updated with the latest market news and developments. Our news section provides real-time updates on market trends, company announcements, and economic indicators that impact your investment decisions.",
    },
    analysis: {
      title: "Analysis",
      description: "Access comprehensive market analysis and research reports from our expert analysts. We provide detailed insights into market trends, sector analysis, and investment opportunities to help you make informed decisions.",
    },
  },
  home: {
    hero: { startInvesting: "Start Investing" },
    about: {
      title: "Why Choose Us",
      description: "We provide professional services in Mongolia's capital market and offer flexible, high-return financial products and services tailored to your goals. Invest with our professional team on a reliable trading platform.",
    },
    services: {
      title: "Our Services",
      trading: {
        title: "Trading",
        description: "Receive real-time market news and information, and make reliable investments through us.",
      },
      portfolioManagement: {
        title: "Portfolio Management",
        description: "Invest systematically in portfolios based on professional research and analysis.",
      },
      riskManagement: {
        title: "Risk Management",
        description: "We offer risk management strategies for all your investment decisions.",
      },
      marketAnalysis: {
        title: "Market Analysis",
        description: "Stay a step ahead with the latest market trends, news and analysis.",
      },
    },
    cta: {
      title: "Get Started Today",
      description: "Start investing with us now and take the first step toward a secure financial future.",
      button: "Create Account",
    },
  },
  error: {
    404: {
      title: "Coming Soon",
      description: "This page is currently not accessible.",
      backToHome: "Back to Home",
    },
  },
  download: {
    title: "Download M-Securities App",
    description: "Choose your platform to download our mobile app",
    iosApp: "iOS App",
    iosDesc: "Download from the App Store",
    iosBtn: "Download for iOS",
    androidApp: "Android App",
    androidDesc: "Download from Google Play Store",
    androidBtn: "Download for Android",
    needHelp: "Need help? Contact our support team",
  },
};
