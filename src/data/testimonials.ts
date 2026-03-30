
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  textAr: string; // ترجمة مؤقتة بالعربية
}

  export const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Basel Ahmed',
      role: 'BIM Engineer',
      company: 'Alghanem Contracting',
      text: "Been attending sessions with Eng. Mahmoud on a Revit course,  great deal of instructing techniques and concise style in delivering information. Also, noticed that eng. Mahmoud gives time to each candidate and builds upon their existing knowledge individually. Highly recommend 👍🏽",
      textAr: "حضرت مع م. محمود كورس ريفيت، أسلوبه في الشرح بسيط وواضح وبيعرف يوصل المعلومة. كمان بيهتم بكل واحد فينا وبيساعدنا على حسب مستوانا. أنصح أي حد بيه 👍🏽"
    },
    {
      id: '2',
      name: 'Kareem Abdelhameed',
      role: 'Project Engineer',
      company: 'Design Consultancy',
      text: "One of the best instructors I have ever encountered. Structural Revit course had great content and practicing opportunities. Highly recommended.",
      textAr: "من أحسن المحاضرين اللي قابلتهم. كورس الريفيت الإنشائي كان فيه معلومات كتير وتطبيق عملي. أنصح بيه جدًا."
    },
    {
      id: '3',
      name: 'Eman Mohamed',
      role: 'Architectural Engineer',
      company: 'Mansoura University',
      text: "Excellent instructor, outstanding content, and accredited certificate.",
      textAr: "محاضر ممتاز، محتوى الكورس رائع والشهادة معتمدة."
    },
    {
      id: '4',
      name: 'Mony Mony Asr',
      role: 'BIM Coordinator',
      company: 'Contracting Company',
      text: "Very good, lots of useful information, and many things I'm learning for the first time. May God increase your knowledge! 💞💞😍",
      textAr: "كورس مفيد جدًا، فيه معلومات كتير أول مرة أعرفها. ربنا يباركلك 💞💞😍"
    },
    {
      id: '5',
      name: 'Mohamed Elsellamy',
      role: 'Civil Engineer',
      company: 'Contracting Company',
      text: "Masha'Allah, in my opinion, he's one of the best lecturers. His lecture delivery was simple and easy to understand, and we benefited from his expertise not only in the course but also in general knowledge.\nMay God grant you success, Engineer.\nAnd I wish you continued excellence and advancement, God willing.",
      textAr: "ما شاء الله، من وجهة نظري من أفضل المحاضرين. شرحه بسيط وسهل واستفدنا من خبرته مش بس في الكورس لكن كمان في حاجات عامة. ربنا يوفقك دايمًا يا باشمهندس."
    },
    {
      id: '6',
      name: 'Mohamed Shawkat',
      role: 'Architect',
      company: 'Design Studio KSA',
      text: "A respected engineer with extensive experience, and in my opinion, one of the best lecturers.",
      textAr: "مهندس محترم وخبرة كبيرة، ومن أفضل المحاضرين اللي اتعلمت منهم."
    },
    {
      id: '7',
      name: 'Mohamed Elnashrty',
      role: 'Structural Engineer',
      company: 'Egypt Construction Company',
      text: "Honestly, the explanation was excellent, and Engineer Mahmoud is one of those people who conveys information in a good way, enabling you to use the program effectively. In addition, he provides complete videos that you can refer back to and review if you forget anything.",
      textAr: "بصراحة الشرح كان ممتاز، والمهندس محمود بيعرف يوصل المعلومة كويس وبيخليك تعرف تستخدم البرنامج. وكمان بيوفر فيديوهات ترجع لها في أي وقت."
    },
    {
      id: '8',
      name: 'Khaled Elgendy',
      role: 'BIM Trainee',
      company: 'Engineering Office',
      text: "He's one of the best lecturers I've ever worked with, and I've learned a lot from him. He truly made a huge difference to me, I swear.",
      textAr: "من أفضل المحاضرين اللي اشتغلت معاهم، واستفدت منه كتير. فرق معايا جدًا والله."
    },
    {
      id: '9',
      name: 'Ahmed shawkat',
      role: 'Site Engineer',
      company: 'Administrative Capital Company',
      text: "I will not talk about experience because this is really taken for granted, I swear. It is a lot of experience, first of all\nSecondly, the spirit that was present and the communication during and after the course has a big role and solves many problems and gives you experience and information, not only in the part where you take the course, but it benefits you in the whole field and above all, a big brother❣️❣️❣️",
      textAr: "مش هتكلم عن الخبرة لأنها واضحة، خبرة كبيرة جدًا. الروح اللي كانت موجودة والتواصل أثناء وبعد الكورس ليه دور كبير وبيحل مشاكل كتير ويديك خبرة مش بس في الكورس لكن في المجال كله وفوق كل ده أخ كبير❣️❣️❣️"
    }
  ];
