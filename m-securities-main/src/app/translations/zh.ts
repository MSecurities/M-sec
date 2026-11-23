import type { Dictionary } from './types';

export const zh: Dictionary = {
  faq: {
    title: "常见问题",
    onlineTrading: {
      title: "在线交易",
      howTo: {
        title: "如何参与在线交易？",
        description1: '如需在 M Securities 证券公司开立在线账户，请登录 https://trader.msecurities.mn/auth/login，点击"注册"按钮，开立证券账户并获得交易权限。',
        description2: "提交申请后，您的账户将在 24 小时内开立，届时您可通过 https://trader.msecurities.mn/auth/login 网站全权参与交易。",
        note: "注意：如果您在开户时填写的个人信息不完整或有误，可能导致账户无法成功开立。请务必如实填写个人信息并上传清晰照片。",
      },
    },
    accountManagement: {
      title: "账户管理",
      forgotPassword: {
        title: "忘记密码时",
        description: '您可以进入 https://trader.msecurities.mn/auth/login 网站或应用程序，点击"找回密码"部分，恢复或更新登录名和密码。',
      },
    },
    contact: { title: "联系我们", subtitle: "关于证券交易", phone: "电话", email: "邮箱" },
    commonQuestions: {
      title: "常见问题",
      questions: [
        {
          question: "什么是股票和债券？二者有什么区别？",
          answer: "股票是一种证券，代表股东对公司所有权的投资。债券则代表公司或政府机构的债务，发行人有义务按照约定在到期后偿还本金并支付利息。\n\n二者的区别在于：股票持有人是公司的股东，有权从公司利润中获得股息，并享有相应的投票权；债券持有人则是发行人的债权人，通常仅享有固定利息收益。",
        },
        { question: "什么是股息？", answer: "股息是公司盈利后分配给股东的利润。股息可以以现金形式支付，也可以以追加股票的形式发放。" },
        { question: "一级市场和二级市场有什么区别？", answer: "在一级市场，公司首次向公众发行新的证券。在二级市场，投资者之间交易已经发行的证券。" },
        { question: "在证券公司开户是什么意思？", answer: "在证券公司开户后，您将成为可以在资本市场买入、卖出并持有证券的正式投资者。" },
        {
          question: "什么是名义账户和受益人账户？什么是中央证券存管中心账户？",
          answer: "名义账户是在证券公司开立的账户，用于以证券公司的名义代您保管证券。\n\n受益人账户是在中央证券存管中心登记的最终实际所有人账户。\n\n中央证券存管中心账户是用于证券保管和转让的基础登记系统。",
        },
        { question: "交易按照什么原则进行？", answer: "交易通过蒙古证券交易所的电子系统进行。投资者向证券公司提交委托，并按照市场价格参与交易。" },
        { question: "如何卖出证券？如何收到资金？", answer: "您可以联系证券公司并提交卖出委托。交易成功后，证券将完成转移，资金将划转至您绑定的银行账户。" },
        { question: "什么是 KYC？", answer: 'KYC，即"了解你的客户"，是依据法律法规对客户信息进行识别和评估的身份核验流程。' },
        { question: "可以把自己的证券转让给他人吗？", answer: "您可以将自己名下的证券转让给他人。为此，需要通过证券公司提交转让申请，并完成相应登记手续。" },
        {
          question: "我需要支付手续费吗？需要缴税吗？",
          answer: "需要。每次参与交易时，均需支付证券公司及交易所相关手续费。如果您以盈利方式出售证券，还需缴纳 10% 的资本收益税。",
        },
        {
          question: "如果已经在其他证券公司登记，还可以在贵公司登记吗？",
          answer: "可以。即使您已在其他证券公司登记，也可以在我公司开户、转入证券并参与交易。您最多可同时在 5 家证券公司登记。",
        },
      ],
      trading: {
        title: "关于交易",
        questions: [
          {
            question: "蒙古证券交易所的交易时间是什么时候？",
            answer: "工作日：\n\n09:00–10:00 – 接收预委托\n\n10:00–13:00 – 连续交易时段\n\n13:00 以后 – 交易后处理阶段\n\n您可以在上述时间之前随时提交委托；在交易时段内，符合条件的委托将被撮合执行。",
          },
          {
            question: "我的委托是否可能无法成交？",
            answer: "是的，您的委托可能因以下原因无法成交：\n\n· 您申报的价格与市场价格不匹配；\n\n· 市场上没有相反方向的委托；\n\n· 您的账户中没有足够的资金或证券。",
          },
          {
            question: "购买证券的资金应在什么时候支付？",
            answer: "提交买入委托前，您需要先将足够资金存入相关交易账户。只有在账户资金充足的情况下，买入委托才能进入交易系统并完成成交与结算。",
          },
          { question: "卖出证券后何时能收到资金？", answer: "成功卖出证券后，资金将于交易日后第二个工作日（T+2）通过证券公司账户划转至您绑定的银行账户。" },
        ],
      },
      account: {
        title: "关于账户",
        questions: [
          { question: "如何开户？", answer: "您可以在线开户，也可以亲自前往 New Horizons Office 4 楼 401 室办理登记。" },
          {
            question: "如何充值账户？",
            answer: '您可登录 https://trader.msecurities.mn/dashboard/app，点击右上方的"入金"窗口，选择需要充值的账户并完成转账。请务必正确填写交易备注。',
          },
          { question: "入金时交易备注填写错误怎么办？", answer: "您可以本人到场，或通过我公司邮箱发送更正申请，请求修改错误信息。" },
        ],
      },
    },
  },
  navbar: {
    about: "关于我们",
    services: "服务",
    research: "研究",
    faqs: "常见问题",
    trade: "交易",
    sections: {
      introduction: "公司简介",
      goal: "使命",
      objective: "目标",
      vision: "愿景",
      values: "价值观",
      feedback: "意见反馈",
      broker: "经纪服务",
      miningBroker: "矿业经纪",
      foreignTrading: "境外交易",
      news: "新闻",
      analysis: "分析",
      commonQuestions: "常见问题",
      weekly: "每周综述",
      openAccount: "开立账户",
      manageAccount: "在线管理账户",
      contact: "联系我们",
      team: "我们的团队",
    },
  },
  footer: {
    tagline: "连接全球收益的桥梁",
    quickLinks: "快速链接",
    followUs: "关注我们",
    contactUs: {
      title: "联系我们",
      email: { label: "邮箱", value: "info@msecurities.mn" },
      phone: {
        label: "电话",
        numbers: [
          "72270008",
          "89819938",
          "86095119",
        ],
      },
      location: { label: "在 Google 地图上查找", text: "拜访我们的办公室" },
    },
    copyright: "版权所有",
    socialLinks: {
      twitter: "在 X 上关注我们",
      instagram: "在 Instagram 上关注我们",
      linkedin: "在 LinkedIn 上关注我们",
      facebook: "在 Facebook 上关注我们",
    },
    mobileApp: {
      title: "移动应用",
      appStore: "从 App Store 下载",
      playStore: "从 Google Play 下载",
      description: "随时随地进行交易",
    },
  },
  about: {
    title: "关于我们",
    objective: { title: "目标", description: "我们是以研究与分析为基础的专业、知识渊博、以客户为中心的可靠顾问。" },
    goal: {
      title: "使命",
      items: [
        "为您提供国际化金融服务",
        "以科技驱动的优质投资解决方案成为行业领先者",
        "提供真实可靠的市场资讯、研究与分析",
        "成为值得信赖的合作伙伴，以及专业、诚信的团队",
      ],
    },
    vision: { title: "愿景", description: "成为一支具有国际竞争力、在本土市场具有重要影响力的专业金融团队。" },
    value: {
      title: "我们的价值观",
      description: "我们的核心价值观引领我们的一切行动",
      items: {
        mastery: { title: "专业精神", description: "我们追求在每一项工作中达到高标准" },
        teamSpirit: { title: "团队合作", description: "为共同目标携手协作" },
        leadership: { title: "领导力", description: "以身作则，激励他人" },
        mcsSpirit: { title: "MCS 价值观", description: "遵循 MCS 集团的核心价值观" },
        creativity: { title: "创造力", description: "探索创新方案与创新实践" },
        integrity: { title: "诚信", description: "坚持高标准的职业道德" },
        sustainable: { title: "可持续发展", description: "为长期未来而建设" },
      },
    },
    introduction: {
      title: "公司简介",
      organizationalHistory: {
        title: "公司历史",
        description1: "M Securities 证券公司是蒙古领先的 MCS Holding LLC 旗下子公司，旨在为蒙古及海外资本市场参与者提供专业的产品与服务。",
        description2: "M Securities 证券公司致力于为证券市场参与者提供及时、专业的信息与研究服务，将国际金融标准与蒙古国本地市场实践有机结合，恪守专业伦理，坚持以客户为中心，推动优质服务与创新技术深度融合。",
      },
      board: {
        title: "董事会",
        chairman: { name: "Myagmarjav G.", position: "董事会主席" },
        member1: { name: "Temuulen B.", position: "董事会成员" },
        member2: { name: "Ariunbayar B.", position: "董事会成员" },
      },
    },
    team: {
      title: "我们的团队",
      list: [
        { name: "Munkhjargal Kh.", position: "首席执行官" },
        { name: "Nomingerel T.", position: "总会计师" },
        { name: "Telmen B.", position: "法律专员" },
        { name: "Munkh-Orgil U.", position: "信息技术专员" },
        { name: "Nomundari B.", position: "国内交易经纪人" },
        { name: "Narankhuu S.", position: "境外交易经纪人" },
        { name: "Khadbaatar D.", position: "经纪人" },
        { name: "Odkhuu B.", position: "经纪人" },
        { name: "Amarsanaa O.", position: "经纪人" },
        { name: "Khuslen B.", position: "经纪人" },
      ],
    },
  },
  services: {
    title: "我们的服务",
    broker: {
      title: "证券经纪服务",
      description: "我们助您投资证券市场，实现财务目标。专业团队为您提供可靠的证券经纪服务。",
      requiredDocs: {
        title: "申请开立账户应出具文件",
        citizen: {
          title: "个人",
          items: [
            "开户申请",
            "身份证",
          ],
        },
        legalEntity: {
          title: "企业法人",
          items: [
            "开户及申请证券经纪服务的申请函（公函 2 份）",
            "国家登记证书（经公证的复印件 2 份）",
            "公司章程（经公证的复印件 2 份）",
            "有权管理账户人员的签字及印章样本（经公证的复印件 2 份）",
            "有权人的身份证件（身份证或护照）",
          ],
        },
        foreignCitizen: {
          title: "外国公民",
          items: [
            "护照（复印件 2 份）",
            "蒙古国居住证",
            "证明在蒙古国或国际知名银行设有账户的文件",
          ],
        },
      },
    },
    miningBroker: {
      title: "矿业经纪服务",
      requiredDocs: {
        title: "所需文件",
        items: [
          "接受经纪服务的正式证明文件",
          "法人国家登记证书",
          "公司章程",
          "授权人员文件",
          "签字授权文件",
          "机构证书及授权委托书（如适用）",
          "税务居民证明",
          "官方签字表格及印章",
          "银行账户详细信息",
          "蒙古国代表处信息（如适用）",
          "股东、管理层及最终受益人文件",
          "特殊经营许可证（如需）",
          "外文文件的英文译本",
        ],
      },
    },
  },
  research: {
    title: "研究",
    news: { title: "新闻", description: "随时了解最新市场动态与资讯。我们的新闻栏目提供市场趋势、公司公告及影响您投资决策的经济指标的实时更新。" },
    analysis: { title: "分析", description: "您可以查阅我们专家提供的详细市场分析与研究报告。我们提供有关市场趋势、行业分析及投资机会的详细信息，助您做出明智的决策。" },
  },
  home: {
    hero: { startInvesting: "开始投资" },
    about: {
      title: "为什么选择我们",
      description: "我们在蒙古国资本市场提供专业服务，为您提供符合您目标的灵活、高收益的金融产品与服务。欢迎与我们的专业团队一起，通过可靠的交易平台进行投资。",
    },
    services: {
      title: "我们的服务",
      trading: { title: "交易", description: "随时获取真实的市场资讯，通过我们进行可靠的投资。" },
      portfolioManagement: { title: "投资组合管理", description: "基于专业的研究与分析，系统地进行投资组合投资。" },
      riskManagement: { title: "风险管理", description: "我们为您的每一项投资决策提供风险管理策略。" },
      marketAnalysis: { title: "市场分析", description: "获取最新的市场趋势、资讯与分析，抢占先机。" },
    },
    cta: { title: "立即开始", description: "现在与我们一起投资，迈出迈向安全财务未来的第一步。", button: "创建账户" },
  },
  error: {
    404: { title: "即将推出", description: "此页面目前无法访问。", backToHome: "返回首页" },
  },
  download: {
    title: "下载 M-Securities 应用",
    description: "选择您的平台下载我们的移动应用",
    iosApp: "iOS 应用",
    iosDesc: "从 App Store 下载",
    iosBtn: "下载 iOS 版本",
    androidApp: "Android 应用",
    androidDesc: "从 Google Play Store 下载",
    androidBtn: "下载 Android 版本",
    needHelp: "需要帮助？请联系我们的支持团队",
  },
};
