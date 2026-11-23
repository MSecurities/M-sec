import type { Language } from '../translations';

// "Үйлчилгээний нөхцөл, нууцлалын бодлого" as signed (MSec-Terms conditions and Confidentiality
// policy-20250102-v1.pdf). The Mongolian text is the original and the one that applies; English and
// Chinese are reference translations, and the page lets their readers switch to the original.
// Clauses are numbered from their position: sections[2].clauses[0] = 3.1.

export type TermsSection = {
  /** Short name for the contents rail and chip bar */
  short: string;
  title: string;
  clauses: readonly string[];
};
export type TermsDoc = {
  /** The unnumbered paragraphs before section one */
  preamble: readonly string[];
  sections: readonly TermsSection[];
};

/** Anchors for the sections: /terms#privacy */
export const SECTION_IDS = ['registration', 'orders', 'fees', 'privacy', 'other'] as const;

export const TERMS_VERSION = 1;
export const TERMS_DATE = { mn: '2025.01.02', en: '2 January 2025', zh: '2025年1月2日' } as const;

const mn: TermsDoc = {
  preamble: [
    'Та “М Секьюритис ҮЦК” ХХК (“Компани”)-ийн үйлчилгээг онлайн системээр дамжуулан авахын өмнө Компанийн үйлчилгээний нөхцөл болон нууцлалын бодлоготой бүрэн танилцаж, зөвшөөрсөн тохиолдолд “Зөвшөөрч байна” гэсэн товчийг дарна уу.',
    'Үйлчилгээний нөхцөл нь харилцагч хувь хүн, хуулийн этгээд Компанийн онлайн системд бүртгэл үүсгэх, онлайн системээр дамжуулан үйлчилгээ авахтай холбоотой харилцааг зохицуулна.',
    'Нууцлалын бодлого нь харилцагч Компанийн онлайн системийг ашиглах явцдаа Компанид гаргаж өгсөн болон ил болгосон мэдээллийг Компани ямар зорилгоор, хэрхэн олж авах, цуглуулах, боловсруулах, ашиглах, бусдад гаргаж өгөх, хадгалах, хамгаалах талаар зохицуулах, энэ талаар танд мэдүүлэх зорилготой баримт бичиг байна. Бидний энэхүү эрх зүйн харилцаа нь Монгол Улсын Иргэний хууль, Хүний хувийн мэдээлэл хамгаалах тухай хууль, Байгууллагын нууцын тухай хууль болон Монгол Улсын бусад холбогдох хууль тогтоомжоор зохицуулагдана.',
    'Харилцагч энэхүү үйлчилгээний нөхцөл, нууцлалын бодлогыг зөвшөөрсөн тохиолдолд Компанийн онлайн системээр дамжуулан үйлчилгээг авах эрхтэй болно.',
  ],
  sections: [
    {
      short: 'Бүртгэл',
      title: 'Онлайн арилжааны систем дэх харилцагчийн бүртгэл',
      clauses: [
        'Харилцагч нь Компанийн онлайн арилжааны системд бүртгэл үүсгэхдээ системийн зааварчилгааны дагуу бөглөхийг шаардсан Харилцагчийн хувийн мэдээлэл болон нууц асуултыг үнэн зөв, бүрэн бөглөнө.',
        'Харилцагч нь онлайн арилжааны системд бүртгүүлснээр Брокерийн дансны мэдээллийг авах, өөрийн мэдээллийг хянах эрхтэй болох ба холбогдох шимтгэл, хураамжийг төлснөөр онлайн арилжааны үйлчилгээг авах эрхтэй болно.',
        'Харилцагч өөрийн онлайн системд нэвтрэх нэр, нууц үг, нууц асуултын хариулт, цахим шуудан, гар утсаар хүлээн авсан мэдээлэл, онлайн системийг хэрэглэх арга хэрэгсэл, үйлчилгээг авахтай холбоотой Компаниас өгсөн заавар зэргийг бусдад задруулахгүй, аюулгүй хадгалах үүрэгтэй. Харилцагч дээрх мэдээллийг бусдад алдсан, ашиглуулсан, ашиглах боломж олгосноос үүдэн бий болсон аливаа хохирлыг Харилцагч бүрэн хариуцна.',
        'Харилцагч онлайн системд бүртгэл үүсгэхдээ өөрийн идэвхитэй ашигладаг цахим шуудангийн хаягийг бүртгүүлэх шаардлагатай. Бүртгүүлсэн цахим шуудангийн хаягаар захиалгын биелэлт, дансны хуулга болон үйлчилгээтэй холбоотой бүхий л мэдээллийг Харилцагчид мэдэгдэх тул цахим хаягийг солихгүй байна.',
      ],
    },
    {
      short: 'Захиалга',
      title: 'Харилцагч онлайн арилжааны системээр захиалга өгөх',
      clauses: [
        'Харилцагч нь үнэт цаасны арилжаанд өөрийн санхүүгийн нөөц бололцоо, хөрөнгө оруулалтын зорилго болон эрсдэл даах чадварыг анхааралтай тооцоолсон, хөрөнгийн биржийн арилжаанд оролцохтой холбогдсон болзошгүй эрсдэлийг ойлгож, хүлээн зөвшөөрч оролцож байгаа болно.',
        'Харилцагчийн хэрэгжүүлж буй аливаа хөрөнгө оруулалт, арилжааны шийдвэр, стратегиуд нь зөвхөн Харилцагчийн болон түүний эрх олгосон этгээдийн бие даан гаргасан хөрөнгө оруулалтын шийдвэр бөгөөд үүнтэй холбоотой эрсдэлийг Харилцагч дангаар хариуцахаа зөвшөөрч байгаа болно.',
        'Харилцагчийн онлайн систем дэх өөрийн бүртгэлээрээ дамжуулан өгсөн данс нээх болон бусад хүсэлт, үнэт цаас худалдах, худалдан авах захиалга, мөнгө хүсэх өргөдөл зэргийг Харилцагчийн баталгаат гарын үсэг, тамга тэмдэг бүхий хүсэлт, захиалгын нэгэн адил хүчин төгөлдөр гэж үзэн Компани нь шууд гүйцэтгэнэ.',
        'Харилцагч нь үнэт цаасны захиалга өгөхдөө үнэт цаасны ханшид зохиомлоор нөлөөлөхгүй, зах зээлийг урвуулан ашиглах аливаа үйлдэл хийхгүй, дотоод мэдээлэл ашиглан арилжаанд оролцохгүй байна.',
        'Анхдагч зах зээлийн арилжаа, ногдол ашиг, ногдол хувийн мөнгөн зарлага гаргах зэрэг нь Үнэт цаасны төвлөрсөн хадгаламжийн төв ХХК-ийн үйл ажиллагаатай хамааралтай тул тухайн байгууллагын үйлчилгээний нөхцөл, цагийн хуваарийн дагуу хийгдэнэ.',
      ],
    },
    {
      short: 'Шимтгэл',
      title: 'Компанийн Үйлчилгээний шимтгэлийн ерөнхий нөхцөл',
      clauses: [
        'Харилцагч нь Компанийн Үйлчилгээний шимтгэлийн ерөнхий нөхцөлтэй бүрэн танилцаж, хүлээн зөвшөөрсөн бөгөөд Харилцагч нь үнэт цаас худалдан авах захиалга өгөхийн тулд захиалгыг биелүүлэхэд хангалттай хэмжээний мөнгийг (үүнд Компанийн болон Арилжааны банкны шимтгэл багтсан байх) өөрийн дансанд байршуулсан байна.',
        'Компанийн Үйлчилгээний шимтгэлийн ерөнхий нөхцөлд заасан хураамж, шимтгэлийг Харилцагчийн данснаас шууд суутгах ба дансны үлдэгдэл нь шимтгэл, хураамжийг суутгахад хүрэлцэхгүй бол гүйлгээ хийгдэхгүй.',
        'Харилцагчийн дансны үлдэгдэл нь тухайн гүйлгээг хийхэд хүрэлцэхгүй, шимтгэл хүрэлцэхгүй, бүрдүүлбэр дутуу, өгөгдөл буруугаас болж гүйлгээ хийгдээгүйгээс шалтгаалан учирсан хохирол, үр дагаврыг Компани хариуцахгүй.',
        'Компани нь Үйлчилгээний шимтгэлийн ерөнхий нөхцөлд нэмэлт өөрчлөлт орсон тохиолдолд өөрийн цахим хуудсанд энэ талаар нийтлэх ба ийнхүү мэдээлэл нийтлэгдсэнээс хойш ажлын 5 хоногийн дотор Харилцагч Компанитай байгуулсан Гэрээнээс татгалзах санал ирүүлээгүй тохиолдолд Харилцагч нэмэлт өөрчлөлтийг хүлээн зөвшөөрсөн гэж үзнэ.',
        'Харилцагч нь Компанийн үйлчилгээний шимтгэл, хураамжид орох нэмэлт өөрчлөлтүүдийг Компанийн цахим хуудсаар дамжуулан танилцах эсхүл өөрийн биеэр Компанид ирж танилцах үүрэг хүлээнэ.',
      ],
    },
    {
      short: 'Нууцлал',
      title: 'Компанийн нууцлалын бодлого',
      clauses: [
        'Харилцагч онлайн системд бүртгүүлэх үедээ системийн үндсэн зааварчилгааны дагуу оруулсан эцэг /эх/-ийн нэр, өөрийн нэр, регистрийн дугаар, төрсөн огноо, хаяг, гар утасны дугаар, цахим шуудангийн хаяг, системд үүсгэсэн нууц үг, нууц асуулт, хариулт, бичиг баримтын хуулбар зэрэг харилцагчийн хувийн мэдээлэл (цаашид “Нууц мэдээлэл” гэх) нь нууц мэдээлэлд хамаарах бөгөөд Компани нь тухайн мэдээллийн нууцлалыг хадгална.',
        'Нууц мэдээлэл нь зөвхөн хэрэглэгчийн өмч байна.',
        'Олон нийтэд нээлттэй, ил тод мэдээлэл болон хуулийн дагуу нийтэд нээлттэй байх мэдээлэл, өгөгдөл нь энэхүү Нууцлалын бодлогын үйлчлэлд хамаарахгүй болно.',
        'Компани нь Харилцагчийн зөвшөөрлийн үндсэн дээр болон Монгол Улсын холбогдох хууль тогтоомжид заасан шаардлагаар зөвхөн Харилцагчийн цахим шууданд мэдээлэл илгээх, системийн хяналт, сайжруулалт, хөгжүүлэлт, тест хийх, бүтээгдэхүүн, үйлчилгээг сайжруулах, шинэ бүтээгдэхүүн, үйлчилгээг хөгжүүлэх, санал гомдлыг шийдвэрлэх, эрсдэлийг үнэлэх, аудит хийх зорилгоор мэдээллийг ашиглана.',
        'Компани нь Харилцагчийн нууц мэдээллийг архив, албан хэрэг хөтлөлт, нягтлан бодох бүртгэл, тайлагналын шаардлагын хүрээнд Монгол Улсын холбогдох хууль тогтоомжид заасан хугацаанаас багагүй хугацаанд болон тухайн мэдээллийг ашиглах шаардлагагүй болох хүртэл хадгална.',
        'Компани нь мэдээллийн аюулгүй байдлыг хангах, хамгаалах чиг үүрэг бүхий нэгжтэй байх бөгөөд тус нэгж нь Харилцагчийн мэдээллийн нууцлал, бүрэн бүтэн байдлыг хангах, хяналт тавих чиг үүрэгтэй байна.',
      ],
    },
    {
      short: 'Бусад',
      title: 'Бусад',
      clauses: [
        'Компани өөрийн санаачлагаар энэхүү Үйлчилгээний нөхцөл, Нууцлалын бодлогод өөрчлөлт оруулж болох бөгөөд өөрчлөлт орсон тухай бүр өөрчлөлтийн талаарх мэдээллийг өөрийн цахим хуудсаар Харилцагчид хүргэнэ.',
        'Хэрэв Үйлчилгээний гол нөхцөл болон Нууцлалын бодлого өөрчлөгдсөнтэй холбогдуулан Компанийн Үйлчилгээг ашиглах, хэрэглэхээс татгалзах тохиолдолд Харилцагч энэхүү Үйлчилгээний нөхцөлийн дагуу Гэрээг цуцалж болно.',
        'Үйлчилгээний нөхцөлийн зарим заалт хүчин төгөлдөр бус байх нь Үйлчилгээний нөхцөлийн бусад заалтын хүчин төгөлдөр байдалд нөлөөлөхгүй.',
        'Энэхүү Үйлчилгээний нөхцөлийг хэрэглэх, тайлбарлахад Монгол Улсын хууль тогтоомжийг удирдлага болгоно.',
      ],
    },
  ],
};

const en: TermsDoc = {
  preamble: [
    'Before receiving the services of M Securities SC LLC (the “Company”) through its online system, please read the Company’s Terms of Service and Privacy Policy in full and, if you agree, press the “I agree” button.',
    'The Terms of Service govern the relationship that arises when a customer, whether an individual or a legal entity, creates an account in the Company’s online system and receives services through it.',
    'The Privacy Policy sets out, and informs you of, for what purposes and how the Company obtains, collects, processes, uses, discloses to others, stores and protects the information that a customer provides or discloses to the Company while using its online system. This legal relationship is governed by the Civil Code of Mongolia, the Law on Personal Data Protection, the Law on Organizational Secrets and other applicable laws and regulations of Mongolia.',
    'Once the customer accepts these Terms of Service and this Privacy Policy, the customer is entitled to receive services through the Company’s online system.',
  ],
  sections: [
    {
      short: 'Registration',
      title: 'Customer registration in the online trading system',
      clauses: [
        'When creating an account in the Company’s online trading system, the Customer shall fill in the personal information and security question required by the system’s instructions truthfully, accurately and completely.',
        'By registering in the online trading system, the Customer becomes entitled to receive brokerage account information and to review their own information, and becomes entitled to the online trading service upon paying the applicable commissions and fees.',
        'The Customer shall keep their online system username, password, security answer, information received by email or mobile phone, the means of accessing the online system and any instructions provided by the Company in connection with the service secure, and shall not disclose them to others. The Customer bears full responsibility for any loss arising from losing this information to others, letting others use it, or making it possible for others to use it.',
        'When creating an account in the online system, the Customer must register an email address that they actively use. Because order executions, account statements and all other service-related information are sent to the Customer at the registered email address, the Customer shall not change this email address.',
      ],
    },
    {
      short: 'Orders',
      title: 'Placing orders through the online trading system',
      clauses: [
        'The Customer participates in securities trading having carefully assessed their own financial resources, investment objectives and risk tolerance, and understanding and accepting the potential risks of trading on the stock exchange.',
        'Any investment, trading decision or strategy the Customer carries out is an investment decision made independently by the Customer or a person they have authorised, and the Customer agrees to bear the related risks alone.',
        'Account opening and other requests, orders to sell or buy securities, fund withdrawal requests and similar instructions submitted through the Customer’s own account in the online system are deemed as valid as requests and orders bearing the Customer’s certified signature and seal, and the Company executes them directly.',
        'When placing securities orders, the Customer shall not artificially influence the price of securities, shall not engage in any form of market manipulation, and shall not trade on insider information.',
        'Primary market trading and the payment of dividends and interest depend on the operations of the Central Securities Depository LLC and are therefore carried out according to that organization’s terms of service and schedule.',
      ],
    },
    {
      short: 'Fees',
      title: 'General terms of the Company’s service fees',
      clauses: [
        'The Customer has read and accepted the Company’s General Terms of Service Fees in full. To place an order to buy securities, the Customer shall have deposited in their account enough funds to execute the order, including the Company’s and the commercial bank’s fees.',
        'The fees and commissions set out in the Company’s General Terms of Service Fees are deducted directly from the Customer’s account; if the account balance is insufficient to cover them, the transaction will not be carried out.',
        'The Company is not liable for any loss or consequence arising from a transaction not being carried out because the Customer’s account balance is insufficient for the transaction, the fees cannot be covered, the required documents are incomplete or the data provided is incorrect.',
        'When the Company’s General Terms of Service Fees are amended, the Company publishes the change on its website. If the Customer does not submit a notice withdrawing from the Agreement concluded with the Company within 5 business days of publication, the Customer is deemed to have accepted the amendment.',
        'The Customer undertakes to review amendments to the Company’s service fees and charges on the Company’s website or in person at the Company’s office.',
      ],
    },
    {
      short: 'Privacy',
      title: 'The Company’s privacy policy',
      clauses: [
        'The personal information the Customer enters according to the system’s basic instructions when registering in the online system — including their patronymic (father’s or mother’s name), given name, national registration number, date of birth, address, mobile phone number, email address, the password, security question and answer created in the system, and copies of documents (hereinafter “Confidential Information”) — is confidential, and the Company shall keep it confidential.',
        'Confidential Information is the sole property of the user.',
        'Information and data that are publicly available and transparent, or that must be made public by law, are not covered by this Privacy Policy.',
        'The Company uses the information, with the Customer’s consent and as required by the applicable laws of Mongolia, solely to send information to the Customer’s email; to monitor, improve, develop and test the system; to improve products and services and develop new ones; to resolve feedback and complaints; to assess risk; and to conduct audits.',
        'The Company retains the Customer’s Confidential Information for archiving, records management, accounting and reporting purposes for no less than the period required by the applicable laws of Mongolia, and until the information is no longer needed.',
        'The Company shall have a unit responsible for ensuring and protecting information security, which is responsible for ensuring and monitoring the confidentiality and integrity of the Customer’s information.',
      ],
    },
    {
      short: 'Other',
      title: 'Other provisions',
      clauses: [
        'The Company may amend these Terms of Service and this Privacy Policy on its own initiative and will inform Customers of each amendment through its website.',
        'If the Customer declines to use the Company’s services because of changes to the main Terms of Service or the Privacy Policy, the Customer may terminate the Agreement in accordance with these Terms of Service.',
        'If any provision of these Terms of Service is invalid, this does not affect the validity of the other provisions.',
        'These Terms of Service are applied and interpreted in accordance with the laws of Mongolia.',
      ],
    },
  ],
};

const zh: TermsDoc = {
  preamble: [
    '在通过在线系统接受 M Securities 证券有限责任公司（以下简称“公司”）的服务之前，请完整阅读公司的服务条款和隐私政策；如您同意，请点击“我同意”按钮。',
    '服务条款规范作为个人或法人的客户在公司在线系统中注册账户以及通过在线系统接受服务的相关关系。',
    '隐私政策旨在规定并告知您：公司出于何种目的、以何种方式获取、收集、处理、使用、向他人提供、存储和保护客户在使用公司在线系统过程中向公司提供或公开的信息。本法律关系受《蒙古国民法》《个人信息保护法》《组织秘密法》以及蒙古国其他相关法律法规的规范。',
    '客户同意本服务条款和隐私政策后，即有权通过公司的在线系统接受服务。',
  ],
  sections: [
    {
      short: '注册',
      title: '在线交易系统中的客户注册',
      clauses: [
        '客户在公司在线交易系统中注册账户时，应按照系统指引，真实、准确、完整地填写系统要求的个人信息及安全问题。',
        '客户在在线交易系统注册后，即有权获取经纪账户信息并查看本人信息；在支付相关佣金和费用后，有权使用在线交易服务。',
        '客户有义务妥善保管其在线系统登录名、密码、安全问题答案、通过电子邮件或手机收到的信息、使用在线系统的工具以及公司就服务提供的指引等，不得向他人泄露。因客户遗失上述信息、让他人使用或使他人有机会使用而造成的任何损失，由客户承担全部责任。',
        '客户在在线系统注册账户时，须登记本人常用的电子邮箱地址。由于公司将通过所登记的电子邮箱向客户发送委托执行情况、账户对账单以及与服务相关的一切信息，客户不得更换该电子邮箱地址。',
      ],
    },
    {
      short: '下单',
      title: '通过在线交易系统下单',
      clauses: [
        '客户参与证券交易时，已审慎评估自身的财务能力、投资目标和风险承受能力，理解并接受参与证券交易所交易可能带来的风险。',
        '客户实施的任何投资、交易决定和策略，均为客户本人或其授权人独立作出的投资决定，客户同意独自承担与此相关的风险。',
        '客户通过其在线系统账户提交的开户及其他申请、证券买卖委托、资金提取申请等，视同附有客户经认证的签名和印章的申请和委托，具有同等效力，公司将直接执行。',
        '客户下达证券委托时，不得人为影响证券价格，不得从事任何操纵市场的行为，不得利用内幕信息进行交易。',
        '一级市场交易以及股息、利息的派发等事项与证券中央托管中心有限责任公司的业务相关，因此按照该机构的服务条款和时间安排进行。',
      ],
    },
    {
      short: '费用',
      title: '公司服务费一般条款',
      clauses: [
        '客户已完整阅读并接受公司的《服务费一般条款》。客户为下达证券买入委托，应在其账户中存入足以执行该委托的资金（包括公司及商业银行的手续费）。',
        '《服务费一般条款》中规定的费用和佣金将直接从客户账户中扣除；如账户余额不足以扣除相关费用和佣金，交易将不予执行。',
        '因客户账户余额不足以完成该笔交易、费用不足、材料不全或数据错误而导致交易未能执行所造成的损失和后果，公司概不负责。',
        '公司《服务费一般条款》如有修改，公司将在其官方网站上公布；自公布之日起 5 个工作日内客户未提出解除与公司所签合同的，视为客户已接受该修改。',
        '客户有义务通过公司官方网站或亲自前往公司了解公司服务费和收费标准的修改情况。',
      ],
    },
    {
      short: '隐私',
      title: '公司隐私政策',
      clauses: [
        '客户在在线系统注册时按照系统基本指引输入的父（母）名、本人姓名、身份登记号码、出生日期、地址、手机号码、电子邮箱地址、在系统中设置的密码、安全问题及答案、证件复印件等客户个人信息（以下简称“保密信息”）属于保密信息，公司将对其保密。',
        '保密信息仅归用户所有。',
        '向公众公开、透明的信息，以及依法应当向公众公开的信息和数据，不适用本隐私政策。',
        '公司仅在征得客户同意的基础上以及根据蒙古国相关法律法规的要求，出于以下目的使用相关信息：向客户电子邮箱发送信息；系统监控、改进、开发和测试；改进产品和服务、开发新产品和服务；处理意见和投诉；评估风险；开展审计。',
        '公司将根据档案管理、文书管理、会计核算及报告要求，在不少于蒙古国相关法律法规规定的期限内，并直至不再需要使用该信息时，保存客户的保密信息。',
        '公司设有负责保障和保护信息安全的部门，该部门负责确保并监督客户信息的保密性和完整性。',
      ],
    },
    {
      short: '其他',
      title: '其他',
      clauses: [
        '公司可主动修改本服务条款和隐私政策，每次修改后将通过其官方网站告知客户。',
        '如客户因服务主要条款或隐私政策的变更而拒绝使用公司服务，客户可根据本服务条款解除合同。',
        '本服务条款中部分条款无效，不影响其他条款的效力。',
        '本服务条款的适用和解释以蒙古国法律法规为准。',
      ],
    },
  ],
};

export const TERMS: Record<Language, TermsDoc> = { mn, en, zh };
